import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function checkAdminAccess() {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return { isAdmin: false, error: 'Unauthorized' }
    }

    if (!prisma) {
      return { isAdmin: false, error: 'Database connection not available' }
    }

    // Check if user is dw_940 or has admin privileges
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      return { isAdmin: false, error: 'User not found' }
    }

    // Check if user is dw_940 or has admin role
    const isAdmin = dbUser.email === process.env.ADMIN_EMAIL || dbUser.isAdmin

    return { isAdmin, user: dbUser, error: null }
  } catch (error) {
    console.error('[ADMIN_CHECK_ERROR]', error)
    return { isAdmin: false, error: 'Internal error' }
  }
}

export async function requireAdmin() {
  const { isAdmin, error } = await checkAdminAccess()
  
  if (!isAdmin) {
    throw new Error(error || 'Admin access required')
  }
  
  return true
}

export function adminApiResponse(error: string, status: number = 403) {
  return new NextResponse(error, { status })
}