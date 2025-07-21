import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const createChatSchema = z.object({
  name: z.string().min(1).max(100),
  provider: z.string().min(1),
  model: z.string().min(1),
  systemPrompt: z.string().optional()
})

const updateChatSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  systemPrompt: z.string().optional()
})

// GET /api/chats - Get user's chats
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ensure user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      // Create user if doesn't exist
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          credits: 10
        }
      })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const [chats, total] = await Promise.all([
      prisma.chat.findMany({
        where: {
          userId: dbUser.id
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc'
            },
            take: 1 // Get first message for preview
          },
          _count: {
            select: {
              messages: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.chat.count({
        where: {
          userId: dbUser.id
        }
      })
    ])

    const formattedChats = chats.map((chat: any) => ({
      id: chat.id,
      name: chat.name,
      provider: chat.provider,
      model: chat.model,
      systemPrompt: chat.systemPrompt,
      messageCount: chat._count.messages,
      totalTokens: chat.totalTokens,
      totalCost: chat.totalCost,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      preview: chat.messages[0]?.content?.substring(0, 100) || null
    }))

    return NextResponse.json({
      success: true,
      data: {
        chats: formattedChats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error: any) {
    console.error('Get chats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/chats - Create new chat
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ensure user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      // Create user if doesn't exist
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          credits: 10
        }
      })
    }

    const body = await req.json()
    const validatedData = createChatSchema.parse(body)
    
    const { name, provider, model, systemPrompt } = validatedData

    const chat = await prisma.chat.create({
      data: {
        userId: dbUser.id,
        name,
        provider,
        model,
        systemPrompt
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: chat.id,
        name: chat.name,
        provider: chat.provider,
        model: chat.model,
        systemPrompt: chat.systemPrompt,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }
    })

  } catch (error: any) {
    console.error('Create chat error:', error)
    
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

// PUT /api/chats - Update chat
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ensure user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get('id')
    
    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const validatedData = updateChatSchema.parse(body)

    // Check if chat exists and belongs to user
    const existingChat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: dbUser.id
      }
    })

    if (!existingChat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    const updatedChat = await prisma.chat.update({
      where: {
        id: chatId
      },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedChat.id,
        name: updatedChat.name,
        provider: updatedChat.provider,
        model: updatedChat.model,
        systemPrompt: updatedChat.systemPrompt,
        createdAt: updatedChat.createdAt,
        updatedAt: updatedChat.updatedAt
      }
    })

  } catch (error: any) {
    console.error('Update chat error:', error)
    
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

// DELETE /api/chats - Delete chat
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ensure user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get('id')
    
    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      )
    }

    // Check if chat exists and belongs to user
    const existingChat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: dbUser.id
      }
    })

    if (!existingChat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // Delete chat and all associated messages (cascade delete)
    await prisma.chat.delete({
      where: {
        id: chatId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Chat deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}