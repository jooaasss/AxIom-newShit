import { db } from '@/lib/db'
import { getUserByClerkId } from '@/lib/db'

export interface CreditCost {
  text: number
  image: number
  code: number
  website: number
}

// Credit costs for different generation types
export const CREDIT_COSTS: CreditCost = {
  text: 1,
  image: 5,
  code: 2,
  website: 3,
}

// Model-specific credit multipliers
export const MODEL_MULTIPLIERS: Record<string, number> = {
  'gpt-4': 2,
  'gpt-4-turbo': 1.5,
  'gpt-3.5-turbo': 1,
  'dall-e-3': 1.5,
  'dall-e-2': 1,
  'claude-3-opus': 2,
  'claude-3-sonnet': 1.5,
  'claude-3-haiku': 1,
  'gemini-pro': 1,
  'llama-3.1-70b-versatile': 1,
  'llama-3.1-8b-instant': 0.5,
}

export function calculateCreditsRequired(
  type: keyof CreditCost,
  model?: string
): number {
  const baseCost = CREDIT_COSTS[type] || 1
  const multiplier = model ? MODEL_MULTIPLIERS[model] || 1 : 1
  return Math.ceil(baseCost * multiplier)
}

export async function getUserCredits(clerkId: string): Promise<number> {
  try {
    const user = await getUserByClerkId(clerkId)
    return user?.credits || 0
  } catch (error) {
    console.error('Failed to get user credits:', error)
    return 0
  }
}

export async function hasEnoughCredits(
  clerkId: string,
  type: keyof CreditCost,
  model?: string
): Promise<boolean> {
  try {
    const userCredits = await getUserCredits(clerkId)
    const requiredCredits = calculateCreditsRequired(type, model)
    return userCredits >= requiredCredits
  } catch (error) {
    console.error('Failed to check credits:', error)
    return false
  }
}

// Alias for compatibility with chat route
export async function checkUserCredits(clerkId: string): Promise<boolean> {
  try {
    const userCredits = await getUserCredits(clerkId)
    return userCredits > 0
  } catch (error) {
    console.error('Failed to check user credits:', error)
    return false
  }
}

export async function deductCredits(
  clerkId: string,
  type: keyof CreditCost,
  model?: string
): Promise<{ success: boolean; remainingCredits: number }> {
  try {
    const user = await getUserByClerkId(clerkId)
    if (!user) {
      throw new Error('User not found')
    }

    const requiredCredits = calculateCreditsRequired(type, model)
    
    if (user.credits < requiredCredits) {
      return {
        success: false,
        remainingCredits: user.credits,
      }
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        credits: user.credits - requiredCredits,
      },
    })

    return {
      success: true,
      remainingCredits: updatedUser.credits,
    }
  } catch (error) {
    console.error('Failed to deduct credits:', error)
    return {
      success: false,
      remainingCredits: 0,
    }
  }
}

export async function addCredits(
  clerkId: string,
  amount: number
): Promise<{ success: boolean; newBalance: number }> {
  try {
    const user = await getUserByClerkId(clerkId)
    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        credits: user.credits + amount,
      },
    })

    return {
      success: true,
      newBalance: updatedUser.credits,
    }
  } catch (error) {
    console.error('Failed to add credits:', error)
    return {
      success: false,
      newBalance: 0,
    }
  }
}

export function getCreditPackages() {
  return [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 100,
      price: 9.99,
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      credits: 500,
      price: 39.99,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pack',
      credits: 1500,
      price: 99.99,
      popular: false,
    },
  ]
}