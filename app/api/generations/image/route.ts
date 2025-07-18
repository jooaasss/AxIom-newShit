import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { prompt } = body

    if (!prompt || prompt.trim() === '') {
      return new NextResponse("Prompt is required", { status: 400 })
    }

    // Get user from database or create if doesn't exist
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          credits: 10, // Default credits for new users
        },
      })
    }

    // Check if user has enough credits
    if (dbUser.credits < 3) { // Image generation costs 3 credits
      return new NextResponse("Insufficient credits", { status: 402 })
    }

    // Simulate AI image generation
    // In a real implementation, this would be replaced with an actual call to an AI service like DALL-E or Midjourney
    const placeholderImageUrl = "https://placehold.co/600x400/3498db/ffffff?text=AI+Generated+Image"

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        userId: dbUser.id,
        prompt,
        type: 'IMAGE',
        content: placeholderImageUrl,
      },
    })

    // Deduct credits
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { credits: { decrement: 3 } },
    })

    return NextResponse.json(generation)
  } catch (error) {
    console.error('[IMAGE_GENERATION]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}