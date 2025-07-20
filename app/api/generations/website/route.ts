import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
    if (!dbUser.hasUnlimitedCredits && dbUser.credits < 5) { // Website generation costs 5 credits
      return new NextResponse("Insufficient credits", { status: 402 })
    }

    // Simulate AI website generation
    // In a real implementation, this would be replaced with an actual call to an AI service
    const websiteHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Generated Website</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      color: #333;
    }
    header {
      background-color: #3498db;
      color: white;
      text-align: center;
      padding: 1rem;
    }
    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    footer {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 1rem;
      position: fixed;
      bottom: 0;
      width: 100%;
    }
  </style>
</head>
<body>
  <header>
    <h1>AI Generated Website</h1>
    <p>Based on your prompt: "${prompt}"</p>
  </header>
  <main>
    <h2>Welcome to your AI-generated website</h2>
    <p>This is a placeholder website. In a real implementation, this would be a fully functional website based on your prompt.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </main>
  <footer>
    <p>&copy; 2023 AI Generated Website</p>
  </footer>
</body>
</html>`

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        userId: dbUser.id,
        prompt,
        type: 'WEBSITE',
        content: websiteHtml,
      },
    })

    // Deduct credits (only for non-unlimited users)
    if (!dbUser.hasUnlimitedCredits) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { credits: { decrement: 5 } },
      })
    }

    return NextResponse.json(generation)
  } catch (error) {
    console.error('[WEBSITE_GENERATION]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}