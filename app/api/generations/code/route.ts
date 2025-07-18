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
    if (dbUser.credits < 2) { // Code generation costs 2 credits
      return new NextResponse("Insufficient credits", { status: 402 })
    }

    // Simulate AI code generation
    const generatedCode = `// This is a simulated AI-generated code based on your prompt: "${prompt}"
// In a real implementation, this would be replaced with an actual call to an AI service like OpenAI's GPT.

function exampleFunction() {
  // This is just a placeholder function
  console.log("Hello, world!");
  
  // Some more code to demonstrate syntax highlighting
  const items = [1, 2, 3, 4, 5];
  const doubled = items.map(item => item * 2);
  
  return doubled;
}

// Call the function
exampleFunction();
`

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        userId: dbUser.id,
        prompt,
        type: 'CODE',
        content: generatedCode,
      },
    })

    // Deduct credits
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { credits: { decrement: 2 } },
    })

    return NextResponse.json(generation)
  } catch (error) {
    console.error('[CODE_GENERATION]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}