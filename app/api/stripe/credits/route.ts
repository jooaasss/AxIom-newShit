import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { absoluteUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2024-06-20',
})

const dashboardUrl = absoluteUrl('/dashboard')
const successUrl = absoluteUrl('/payment/success')
const cancelUrl = absoluteUrl('/payment/cancel')

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { amount } = body

    if (!amount || typeof amount !== 'number') {
      return new NextResponse("Amount is required and must be a number", { status: 400 })
    }

    // Get user from database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          credits: 0,
        },
      })
    }

    // Calculate price based on amount of credits
    // 100 credits = $10, 500 credits = $40, 1000 credits = $70
    let unitAmount = 0
    let credits = 0

    switch (amount) {
      case 100:
        unitAmount = 1000 // $10.00
        credits = 100
        break
      case 500:
        unitAmount = 4000 // $40.00
        credits = 500
        break
      case 1000:
        unitAmount = 7000 // $70.00
        credits = 1000
        break
      default:
        return new NextResponse("Invalid amount", { status: 400 })
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
      mode: 'payment',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: `${credits} AI Credits`,
              description: `${credits} credits for AI generations`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: dbUser.id,
        credits,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[STRIPE_CREDITS_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}