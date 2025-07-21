import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_secret_for_build'
    )
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // Handle successful checkout sessions
  if (event.type === 'checkout.session.completed') {
    if (!session?.metadata?.userId) {
      return new NextResponse('User ID is required', { status: 400 })
    }

    // Check if this is a subscription or one-time payment
    if (session.mode === 'subscription' && session.subscription) {
      // Handle subscription
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      await prisma.user.update({
        where: {
          id: session.metadata.userId,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      })
    } else if (session.mode === 'payment' && session.metadata?.credits) {
      // Handle credit purchase
      const credits = parseInt(session.metadata.credits)
      
      // Get current user credits and add new credits
      const user = await prisma.user.findUnique({
        where: { id: session.metadata.userId },
        select: { credits: true }
      })
      
      if (user) {
        await prisma.user.update({
          where: {
            id: session.metadata.userId,
          },
          data: {
            credits: (user.credits || 0) + credits,
            stripeCustomerId: session.customer as string,
          },
        })
      }
    }
  }

  // Handle subscription updates
  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update user subscription info
    await prisma.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  return NextResponse.json({ received: true })
}