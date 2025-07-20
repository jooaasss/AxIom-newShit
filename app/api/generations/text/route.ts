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

    if (!prisma) {
      return new NextResponse('Database connection not available', { status: 500 })
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

    // Check if user has enough credits (skip check for unlimited users)
    if (!dbUser.hasUnlimitedCredits && dbUser.credits < 1) {
      return new NextResponse("Insufficient credits", { status: 402 })
    }

    // Simulate AI text generation
    const generatedText = `This is a simulated AI-generated text based on your prompt: "${prompt}". In a real implementation, this would be replaced with an actual call to an AI service like OpenAI's GPT.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        userId: dbUser.id,
        prompt,
        type: 'TEXT',
        content: generatedText,
      },
    })

    // Deduct credits (only for non-unlimited users)
    if (!dbUser.hasUnlimitedCredits) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { credits: { decrement: 1 } },
      })
    }

    return NextResponse.json(generation)
  } catch (error) {
    console.error('[TEXT_GENERATION]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}