import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!prisma) {
      return new NextResponse('Database connection not available', { status: 500 })
    }

    // Find user by clerkId first
    let dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        credits: true,
        isAdmin: true,
        hasUnlimitedCredits: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!dbUser) {
      // Check if user exists with this email
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.emailAddresses[0].emailAddress,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          credits: true,
          isAdmin: true,
          hasUnlimitedCredits: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (existingUser) {
        // Update existing user with new clerkId
        dbUser = await prisma.user.update({
          where: {
            email: user.emailAddresses[0].emailAddress,
          },
          data: {
            clerkId: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            credits: true,
            isAdmin: true,
            hasUnlimitedCredits: true,
            createdAt: true,
            updatedAt: true
          }
        })
      } else {
        // Create new user
        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            credits: 10,
            isAdmin: false,
            hasUnlimitedCredits: false
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            credits: true,
            isAdmin: true,
            hasUnlimitedCredits: true,
            createdAt: true,
            updatedAt: true
          }
        })
      }
    }

    return NextResponse.json(dbUser)
  } catch (error) {
    console.error('[USER_PROFILE_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}