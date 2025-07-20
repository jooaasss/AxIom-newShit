import { NextResponse } from 'next/server'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const payload: WebhookEvent = await req.json()
    const { type, data } = payload

    if (!prisma) {
      return new NextResponse('Database connection not available', { status: 500 })
    }

    // Handle user creation
    if (type === 'user.created') {
      const { id, email_addresses } = data

      // Create a new user in the database
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          credits: 10, // Default credits for new users
        },
      })
    }

    // Handle user deletion
    if (type === 'user.deleted') {
      const { id } = data

      // Delete the user from the database
      await prisma.user.delete({
        where: {
          clerkId: id,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[WEBHOOK_ERROR]', error)
    return new NextResponse('Webhook Error', { status: 500 })
  }
}