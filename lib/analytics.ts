import { db } from '@/lib/db'

export interface AnalyticsEvent {
  userId?: string
  event: string
  properties?: Record<string, any>
  timestamp?: Date
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    // In a real application, you might want to send this to an analytics service
    // like PostHog, Mixpanel, or Google Analytics
    console.log('Analytics Event:', event)
    
    // For now, we'll just log it
    // You can extend this to send to your preferred analytics service
    return true
  } catch (error) {
    console.error('Failed to track event:', error)
    return false
  }
}

export async function trackGeneration({
  userId,
  type,
  model,
  provider,
  tokens,
  cost,
}: {
  userId: string
  type: string
  model?: string
  provider?: string
  tokens?: number
  cost?: number
}) {
  return trackEvent({
    userId,
    event: 'generation_created',
    properties: {
      type,
      model,
      provider,
      tokens,
      cost,
    },
  })
}

export async function trackUserSignup(userId: string, email: string) {
  return trackEvent({
    userId,
    event: 'user_signup',
    properties: {
      email,
    },
  })
}

export async function trackPurchase({
  userId,
  amount,
  credits,
  sessionId,
}: {
  userId: string
  amount: number
  credits: number
  sessionId: string
}) {
  return trackEvent({
    userId,
    event: 'purchase_completed',
    properties: {
      amount,
      credits,
      sessionId,
    },
  })
}

export async function getAnalytics(userId?: string) {
  try {
    // Get basic analytics from database
    const totalGenerations = await db.generation.count({
      where: userId ? { userId } : undefined,
    })
    
    const totalUsers = await db.user.count()
    
    const totalPurchases = await db.purchase.count({
      where: {
        status: 'COMPLETED',
        ...(userId && { userId }),
      },
    })
    
    return {
      totalGenerations,
      totalUsers,
      totalPurchases,
    }
  } catch (error) {
    console.error('Failed to get analytics:', error)
    return {
      totalGenerations: 0,
      totalUsers: 0,
      totalPurchases: 0,
    }
  }
}