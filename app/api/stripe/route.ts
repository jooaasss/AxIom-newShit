import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { absoluteUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2025-02-24.acacia',
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

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    console.log('Stripe API request body:', body)
    
    const { priceId, cycle } = body

    if (!priceId) {
      console.log('Missing priceId in request')
      return new NextResponse("Price ID is required", { status: 400 })
    }
    
    console.log('Processing subscription with priceId:', priceId, 'cycle:', cycle)

    // Check if Stripe is properly configured
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey || stripeKey.includes('dummy') || stripeKey === 'sk_test_51234567890abcdef') {
      console.log('Stripe not properly configured')
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 503 }
      )
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

    // Create a checkout session with the provided price ID or create price dynamically
    let sessionConfig: any = {
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      metadata: {
        userId: dbUser.id,
        cycle: cycle || 'monthly',
      },
    }

    // Always create price dynamically since we don't have real Stripe setup
    const amount = cycle === 'annually' ? 14400 : 2000 // $144 or $20
    const interval = cycle === 'annually' ? 'year' : 'month'
    
    sessionConfig.line_items = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'AxIom Pro Subscription',
            description: 'Unlimited AI generations with advanced features',
          },
          unit_amount: amount,
          recurring: {
            interval: interval,
          },
        },
        quantity: 1,
      },
    ]

    console.log('Creating Stripe session with config:', JSON.stringify(sessionConfig, null, 2))
    const session = await stripe.checkout.sessions.create(sessionConfig)
    console.log('Stripe session created successfully:', session.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      requestId: error.requestId,
      stack: error.stack
    })
    return NextResponse.json(
      { error: 'Failed to create checkout session: ' + error.message },
      { status: 500 }
    )
  }
}