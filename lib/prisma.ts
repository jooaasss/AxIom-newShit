import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set. Database operations will fail.')
    return null
  }

  try {
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    return null
  }
}

export const prisma = globalThis.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalThis.prisma = prisma
}