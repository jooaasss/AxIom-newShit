import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateText } from '@/lib/ai-providers'

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

    // Check if user has enough credits (skip check for unlimited users)
    if (!dbUser.hasUnlimitedCredits && dbUser.credits < 2) { // Code generation costs 2 credits
      return new NextResponse("Insufficient credits", { status: 402 })
    }

    // Generate code using Hugging Face provider with fallback
    let result
    try {
      result = await generateText(`Generate clean, well-commented code for: ${prompt}`, {
        provider: 'huggingface',
        model: 'Qwen/Qwen2.5-Coder-32B-Instruct:featherless-ai',
        maxTokens: 1000,
        temperature: 0.3,
      })
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError)
      // Fallback response if AI fails
      result = {
        content: `// Generated code for: ${prompt}\n\nfunction generatedFunction() {\n  // TODO: Implement your logic here\n  console.log('Code generation request: ${prompt}');\n  return 'success';\n}\n\n// Note: AI generation temporarily unavailable`,
        tokens: 50,
        cost: 0,
        model: 'fallback',
        provider: 'huggingface'
      }
    }
    
    const generatedCode = result.content

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        userId: dbUser.id,
        prompt,
        type: 'CODE',
        content: generatedCode,
      },
    })

    // Deduct credits (only for non-unlimited users)
    if (!dbUser.hasUnlimitedCredits) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { credits: { decrement: 2 } },
      })
    }

    return NextResponse.json(generation)
  } catch (error) {
    console.error('[CODE_GENERATION] Detailed error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    console.error('[CODE_GENERATION] Error stack:', errorStack)
    return new NextResponse(`Internal Error: ${errorMessage}`, { status: 500 })
  }
}