import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ratelimit } from '@/lib/ratelimit'
import { trackGeneration } from '@/lib/analytics'
import { getAIProvider, type AIProvider } from '@/lib/ai-providers'
import { prisma } from '@/lib/prisma'
import { checkUserCredits, deductCredits } from '@/lib/credits'
import { getUserByClerkId, createUser } from '@/lib/db'

const chatRequestSchema = z.object({
  message: z.string().min(1).max(10000),
  chatId: z.string().optional(),
  provider: z.string().min(1),
  model: z.string().min(1),
  maxTokens: z.number().min(1).max(4000).optional().default(2000),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  systemPrompt: z.string().optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).optional().default([])
})

export async function POST(req: NextRequest) {
  console.log('=== CHAT API POST REQUEST RECEIVED ===')
  console.log('Request URL:', req.url)
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))
  
  try {
    const { userId } = await auth()
    console.log('User ID from auth:', userId)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get or create user in database
    let dbUser = await getUserByClerkId(userId)
    if (!dbUser) {
      // Create user if they don't exist with a temporary email
      // This will be updated when user profile is accessed
      dbUser = await createUser({
        clerkId: userId,
        email: `temp_${userId}@temp.com`
      })
      
      // Set default credits
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { credits: 100 }
      })
    }

    // Rate limiting
    const identifier = `chat_${userId}`
    const { success } = await ratelimit.limit(identifier)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const validatedData = chatRequestSchema.parse(body)
    
    const {
      message,
      chatId,
      provider,
      model,
      maxTokens,
      temperature,
      systemPrompt,
      conversationHistory
    } = validatedData

    // Check user credits
    const hasCredits = await checkUserCredits(userId)
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan.' },
        { status: 402 }
      )
    }

    // Get AI provider
    const aiProvider = getAIProvider(provider as AIProvider)
    if (!aiProvider) {
      return NextResponse.json(
        { error: `Provider ${provider} not found` },
        { status: 400 }
      )
    }

    // Prepare conversation context
    const messages = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ]

    // Create or update chat in database
    let chat
    if (chatId) {
      chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          userId: dbUser.id
        }
      })
      
      if (!chat) {
        return NextResponse.json(
          { error: 'Chat not found' },
          { status: 404 }
        )
      }
    } else {
      // Create new chat
      chat = await prisma.chat.create({
        data: {
          userId: dbUser.id,
          name: message.length > 50 ? message.substring(0, 50) + '...' : message,
          provider,
          model,
          systemPrompt
        }
      })
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: 'user',
        content: message
      }
    })

    const startTime = Date.now()
    let totalTokens = 0
    let cost = 0

    try {
      // Generate AI response
      const response = await aiProvider.generateText({
        model,
        messages,
        maxTokens,
        temperature
      })

      totalTokens = response.usage?.total_tokens || 0
      cost = response.cost || 0

      // Save assistant message
      await prisma.chatMessage.create({
        data: {
          chatId: chat.id,
          role: 'assistant',
          content: response.content,
          tokens: totalTokens,
          cost
        }
      })

      // Update chat
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          updatedAt: new Date(),
          totalTokens: {
            increment: totalTokens
          },
          totalCost: {
            increment: cost
          }
        }
      })

      // Deduct credits
      await deductCredits(userId, 'text')

      // Track generation
      await trackGeneration({
        userId,
        type: 'chat',
        model,
        provider,
        tokens: totalTokens,
        cost
      })

      return NextResponse.json({
        success: true,
        data: {
          chatId: chat.id,
          content: response.content,
          tokens: totalTokens,
          cost,
          provider,
          model,
          usage: response.usage
        }
      })

    } catch (error: any) {
      console.error('AI generation error:', error)
      
      // Track failed generation
      await trackGeneration({
        userId,
        type: 'chat',
        model,
        provider,
        tokens: 0,
        cost: 0
      })

      // Return specific error message if available
      const errorMessage = error.message || 'Failed to generate response. Please try again.'
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Chat API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}