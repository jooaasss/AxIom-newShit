import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { generateImage, getAvailableProviders, type AIProvider } from '@/lib/ai-providers'
import { db, getUserByClerkId, createGeneration, updateUserCredits } from '@/lib/db'
import { sanitizeInput } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const imageGenerationSchema = z.object({
  prompt: z.string().min(1).max(1000),
  provider: z.enum(['openai', 'huggingface']).optional(),
  model: z.string().optional(),
  size: z.string().optional(),
  quality: z.enum(['standard', 'hd']).optional(),
  style: z.enum(['vivid', 'natural']).optional(),
  n: z.number().min(1).max(4).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = imageGenerationSchema.parse(body)

    // Get user and check credits
    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Image generation costs more credits
    const creditsRequired = validatedData.provider === 'openai' ? 3 : 2
    if (user.credits < creditsRequired) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    // Sanitize input
    const sanitizedPrompt = sanitizeInput(validatedData.prompt)

    // Create generation record
    const generation = await createGeneration({
      userId: user.id,
      type: 'IMAGE',
      prompt: sanitizedPrompt,
      status: 'PROCESSING',
      model: validatedData.model || 'dall-e-3',
    })

    try {
      // Generate image
      const result = await generateImage(sanitizedPrompt, {
        provider: validatedData.provider as AIProvider,
        model: validatedData.model,
        size: validatedData.size,
        quality: validatedData.quality,
        style: validatedData.style,
        n: validatedData.n,
      })

      // Update generation with result
      await db.generation.update({
        where: { id: generation.id },
        data: {
          imageUrl: result.imageUrl,
          status: 'COMPLETED',
          cost: result.cost,
          model: result.model,
          metadata: {
            provider: result.provider,
            size: validatedData.size,
            quality: validatedData.quality,
            style: validatedData.style,
          },
        },
      })

      // Deduct credits
      await updateUserCredits(user.id, user.credits - creditsRequired)

      return NextResponse.json({
        id: generation.id,
        imageUrl: result.imageUrl,
        cost: result.cost,
        model: result.model,
        provider: result.provider,
        creditsRemaining: user.credits - creditsRequired,
      })

    } catch (error) {
      // Update generation status to failed
      await db.generation.update({
        where: { id: generation.id },
        data: {
          status: 'FAILED',
        },
      })

      console.error('Image generation error:', error)
      return NextResponse.json(
        { error: 'Image generation failed' },
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
        type: 'IMAGE',
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