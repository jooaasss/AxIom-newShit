import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// User operations
export async function getUserByClerkId(clerkId: string) {
  return await db.user.findUnique({
    where: { clerkId },
  })
}

export async function createUser(data: {
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
}) {
  return await db.user.create({
    data,
  })
}

export async function updateUserCredits(userId: string, credits: number) {
  return await db.user.update({
    where: { id: userId },
    data: { credits },
  })
}

// Generation operations
export async function createGeneration(data: {
  userId: string
  type: 'TEXT' | 'IMAGE' | 'CODE' | 'WEBSITE'
  prompt: string
  status?: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  model?: string
}) {
  return await db.generation.create({
    data,
  })
}

export async function updateGeneration(
  id: string,
  data: {
    content?: string
    imageUrl?: string
    status?: 'PROCESSING' | 'COMPLETED' | 'FAILED'
    tokens?: number
    cost?: number
    model?: string
    metadata?: any
  }
) {
  return await db.generation.update({
    where: { id },
    data,
  })
}

export async function getUserGenerations(
  userId: string,
  type?: 'TEXT' | 'IMAGE' | 'CODE' | 'WEBSITE',
  limit = 20,
  offset = 0
) {
  return await db.generation.findMany({
    where: {
      userId,
      ...(type && { type }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
  })
}

export async function getGenerationById(id: string) {
  return await db.generation.findUnique({
    where: { id },
    include: {
      user: true,
    },
  })
}

// Purchase operations
export async function createPurchase(data: {
  userId: string
  stripeSessionId: string
  amount: number
  credits: number
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
}) {
  return await db.purchase.create({
    data,
  })
}

export async function updatePurchase(
  id: string,
  data: {
    status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
    amount?: number
    credits?: number
  }
) {
  return await db.purchase.update({
    where: { id },
    data,
  })
}

export async function getPurchaseBySessionId(stripeSessionId: string) {
  return await db.purchase.findUnique({
    where: { stripeSessionId },
    include: {
      user: true,
    },
  })
}

export async function getUserPurchases(userId: string, limit = 20, offset = 0) {
  return await db.purchase.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
  })
}