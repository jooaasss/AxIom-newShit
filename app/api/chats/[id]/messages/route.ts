import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/chats/[id]/messages - Get messages for a specific chat
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const chatId = params.id
    
    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      )
    }

    // Check if chat exists and belongs to user
    const chat = await prisma.chat.findFirst({
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

    // Get messages for the chat
    const messages = await prisma.chatMessage.findMany({
      where: {
        chatId
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const formattedMessages = messages.map(message => ({
      id: message.id,
      role: message.role,
      content: message.content,
      tokens: message.tokens,
      cost: message.cost,
      createdAt: message.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        chatId: chat.id,
        chatName: chat.name,
        messages: formattedMessages
      }
    })

  } catch (error: any) {
    console.error('Get chat messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}