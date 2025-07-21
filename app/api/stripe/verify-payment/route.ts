import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2024-06-20',
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { sessionId } = body

    if (!sessionId) {
      return new NextResponse("Session ID is required", { status: 400 })
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return new NextResponse("Session not found", { status: 404 })
    }

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return new NextResponse("Payment not completed", { status: 400 })
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Prepare response data
    const responseData: any = {
      amount: (session.amount_total || 0) / 100, // Convert from cents
      currency: session.currency,
      status: session.payment_status,
      sessionId: session.id,
    }

    // If this was a credit purchase, include credit information
    if (session.metadata?.credits) {
      responseData.credits = parseInt(session.metadata.credits)
      responseData.type = 'credits'
    } else {
      responseData.type = 'subscription'
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('[STRIPE_VERIFY_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}