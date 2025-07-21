import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { absoluteUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2024-06-20',
})

const settingsUrl = absoluteUrl('/settings')
const successUrl = absoluteUrl('/payment/success')
const cancelUrl = absoluteUrl('/payment/cancel')

export async function GET() {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    // If user already has a Stripe customer ID, create a billing portal session
    if (dbUser.stripeCustomerId) {
      const session = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: settingsUrl,
      })

      return NextResponse.json({ url: session.url })
    }

    // Otherwise, create a checkout session for a new subscription
    const session = await stripe.checkout.sessions.create({
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: 'Polniy Pro',
              description: 'Unlimited AI generations',
            },
            unit_amount: 2000, // $20.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: dbUser.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[STRIPE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}