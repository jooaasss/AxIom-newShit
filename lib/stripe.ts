import Stripe from 'stripe'
import { db, getUserByClerkId, createPurchase, updatePurchase, updateUserCredits } from './db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2025-02-24.acacia',
})

export { stripe }

// Credit packages
export const CREDIT_PACKAGES = {
  starter: {
    credits: 50,
    price: 9.99,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    name: 'Starter Pack',
    description: '50 credits for basic usage',
  },
  pro: {
    credits: 200,
    price: 29.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    name: 'Pro Pack',
    description: '200 credits for power users',
    popular: true,
  },
  enterprise: {
    credits: 500,
    price: 59.99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    name: 'Enterprise Pack',
    description: '500 credits for teams',
  },
}

// Create checkout session
export async function createCheckoutSession(
  userId: string,
  packageKey: keyof typeof CREDIT_PACKAGES,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const user = await getUserByClerkId(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const creditPackage = CREDIT_PACKAGES[packageKey]
    if (!creditPackage || !creditPackage.priceId) {
      throw new Error('Invalid credit package')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: creditPackage.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        credits: creditPackage.credits.toString(),
        package: packageKey,
      },
    })

    // Create purchase record
    await createPurchase({
      userId: user.id,
      stripeSessionId: session.id,
      amount: creditPackage.price,
      credits: creditPackage.credits,
      status: 'PENDING',
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Handle successful payment
export async function handleSuccessfulPayment(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed')
    }

    const purchase = await db.purchase.findUnique({
      where: { stripeSessionId: sessionId },
      include: { user: true },
    })

    if (!purchase) {
      throw new Error('Purchase not found')
    }

    if (purchase.status === 'COMPLETED') {
      return purchase // Already processed
    }

    // Update purchase status
    await updatePurchase(purchase.id, {
      status: 'COMPLETED',
    })

    // Add credits to user
    const newCredits = purchase.user.credits + purchase.credits
    await updateUserCredits(purchase.userId, newCredits)

    return purchase
  } catch (error) {
    console.error('Error handling successful payment:', error)
    throw error
  }
}

// Handle failed payment
export async function handleFailedPayment(sessionId: string) {
  try {
    const purchase = await db.purchase.findUnique({
      where: { stripeSessionId: sessionId },
    })

    if (purchase && purchase.status !== 'FAILED') {
      await updatePurchase(purchase.id, {
        status: 'FAILED',
      })
    }

    return purchase
  } catch (error) {
    console.error('Error handling failed payment:', error)
    throw error
  }
}

// Webhook handler
export async function handleStripeWebhook(
  body: string,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_secret_for_build'

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    throw new Error('Invalid webhook signature')
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      await handleSuccessfulPayment(session.id)
      break
    }
    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      await handleFailedPayment(session.id)
      break
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      if (paymentIntent.metadata?.sessionId) {
        await handleFailedPayment(paymentIntent.metadata.sessionId)
      }
      break
    }
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return { received: true }
}

// Get customer portal URL
export async function createCustomerPortalSession(
  userId: string,
  returnUrl: string
) {
  try {
    const user = await getUserByClerkId(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Find or create Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    })

    let customerId: string
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        metadata: {
          userId: user.id,
          clerkId: user.clerkId,
        },
      })
      customerId = customer.id
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw error
  }
}

// Get payment history
export async function getPaymentHistory(userId: string) {
  try {
    const user = await getUserByClerkId(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const purchases = await db.purchase.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return purchases
  } catch (error) {
    console.error('Error getting payment history:', error)
    throw error
  }
}