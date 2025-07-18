import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { generateText, getAvailableProviders, getProviderModels, type AIProvider } from '@/lib/ai-providers'
import { db, getUserByClerkId, createGeneration, updateUserCredits } from '@/lib/db'
import { sanitizeInput } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const textGenerationSchema = z.object({
  prompt: z.string().min(1).max(10000),
  provider: z.enum(['openai', 'groq', 'huggingface', 'gemini', 'cohere', 'grok']).optional(),
  model: z.string().optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  topP: z.number().min(0).max(1).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = textGenerationSchema.parse(body)

    // Get user and check credits
    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    // Sanitize input
    const sanitizedPrompt = sanitizeInput(validatedData.prompt)

    // Create generation record
    const generation = await createGeneration({
      userId: user.id,
      type: 'TEXT',
      prompt: sanitizedPrompt,
      status: 'PROCESSING',
      model: validatedData.model || 'gpt-4-turbo-preview',
    })

    try {
      // Generate text
      const result = await generateText(sanitizedPrompt, {
        provider: validatedData.provider as AIProvider,
        model: validatedData.model,
        maxTokens: validatedData.maxTokens,
        temperature: validatedData.temperature,
        topP: validatedData.topP,
        presencePenalty: validatedData.presencePenalty,
        frequencyPenalty: validatedData.frequencyPenalty,
      })

      // Update generation with result
      await db.generation.update({
        where: { id: generation.id },
        data: {
          content: result.content,
          status: 'COMPLETED',
          tokens: result.tokens,
          cost: result.cost,
          model: result.model,
          metadata: {
            provider: result.provider,
          },
        },
      })

      // Deduct credits
      await updateUserCredits(user.id, user.credits - 1)

      return NextResponse.json({
        id: generation.id,
        content: result.content,
        tokens: result.tokens,
        cost: result.cost,
        model: result.model,
        provider: result.provider,
        creditsRemaining: user.credits - 1,
      })

    } catch (error) {
      // Update generation status to failed
      await db.generation.update({
        where: { id: generation.id },
        data: {
          status: 'FAILED',
        },
      })

      console.error('Text generation error:', error)
      return NextResponse.json(
        { error: 'Text generation failed' },
        { status: 500 }
      )
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const generations = await db.generation.findMany({
      where: {
        userId: user.id,
        type: 'TEXT',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ generations })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}