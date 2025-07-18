import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Setup admin user (dw_940)
export async function POST() {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if the user is dw_940
    if (user.emailAddresses[0]?.emailAddress !== 'kalitestakk@gmail.com') {
      return new NextResponse('Only dw_940 can setup admin access', { status: 403 })
    }

    // Find or create the user in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      // Check if user exists with this email
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.emailAddresses[0].emailAddress,
        },
      })

      if (existingUser) {
        // Update existing user with new clerkId and admin privileges
        dbUser = await prisma.user.update({
          where: {
            email: user.emailAddresses[0].emailAddress,
          },
          data: {
            clerkId: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            isAdmin: true,
            hasUnlimitedCredits: true,
            credits: 999999999 // Set to a very high number for unlimited
          },
        })
      } else {
        // Create new user with admin privileges
        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            isAdmin: true,
            hasUnlimitedCredits: true,
            credits: 999999999 // Set to a very high number for unlimited
          },
        })
      }
    } else {
      // Update existing user to have admin privileges
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          isAdmin: true,
          hasUnlimitedCredits: true,
          credits: 999999999 // Set to a very high number for unlimited
        },
      })
    }

    return NextResponse.json({ 
      message: 'Admin setup completed successfully',
      user: {
        id: dbUser.id,
        email: dbUser.email,
        isAdmin: dbUser.isAdmin,
        hasUnlimitedCredits: dbUser.hasUnlimitedCredits,
        credits: dbUser.credits
      }
    })
  } catch (error) {
    console.error('[ADMIN_SETUP_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}