import { NextResponse } from 'next/server'
import { checkAdminAccess, adminApiResponse } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// Get all users
export async function GET() {
  try {
    const { isAdmin, error } = await checkAdminAccess()
    
    if (!isAdmin) {
      return adminApiResponse(error || 'Admin access required')
    }

    if (!prisma) {
      return adminApiResponse('Database connection not available', 500)
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        credits: true,
        isAdmin: true,
        hasUnlimitedCredits: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            generations: true,
            purchases: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('[ADMIN_USERS_GET]', error)
    return adminApiResponse('Internal Error', 500)
  }
}

// Update user
export async function PATCH(req: Request) {
  try {
    const { isAdmin, error } = await checkAdminAccess()
    
    if (!isAdmin) {
      return adminApiResponse(error || 'Admin access required')
    }

    const body = await req.json()
    const { userId, updates } = body

    if (!userId) {
      return adminApiResponse('User ID is required', 400)
    }

    // Validate updates
    const allowedUpdates = ['credits', 'isAdmin', 'hasUnlimitedCredits', 'firstName', 'lastName']
    const filteredUpdates: any = {}
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = value
      }
    }

    if (!prisma) {
      return adminApiResponse('Database connection not available', 500)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: filteredUpdates,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        credits: true,
        isAdmin: true,
        hasUnlimitedCredits: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('[ADMIN_USERS_PATCH]', error)
    return adminApiResponse('Internal Error', 500)
  }
}