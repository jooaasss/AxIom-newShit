import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const apiKeySchema = z.object({
  provider: z.enum(['openai', 'groq', 'google', 'cohere', 'huggingface', 'grok', 'deepseek']),
  apiKey: z.string().min(1, 'API key is required'),
})

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        apiKeys: {
          select: {
            id: true,
            provider: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            // Не возвращаем сам API ключ из соображений безопасности
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ apiKeys: user.apiKeys })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = apiKeySchema.parse(body)

    // Проверяем, есть ли уже ключ для этого провайдера
    const existingKey = await prisma.userAPIKey.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: validatedData.provider
        }
      }
    })

    if (existingKey) {
      // Обновляем существующий ключ
      const updatedKey = await prisma.userAPIKey.update({
        where: { id: existingKey.id },
        data: {
          apiKey: validatedData.apiKey,
          isActive: true,
          updatedAt: new Date()
        },
        select: {
          id: true,
          provider: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      return NextResponse.json({ apiKey: updatedKey })
    } else {
      // Создаем новый ключ
      const newKey = await prisma.userAPIKey.create({
        data: {
          userId: user.id,
          provider: validatedData.provider,
          apiKey: validatedData.apiKey,
          isActive: true
        },
        select: {
          id: true,
          provider: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      return NextResponse.json({ apiKey: newKey })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error saving API key:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider')

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 })
    }

    await prisma.userAPIKey.deleteMany({
      where: {
        userId: user.id,
        provider: provider
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}