import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!prisma) {
      console.warn('Database not available, returning empty generations')
      return NextResponse.json([])
    }

    const generations = await prisma.generation.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(generations)
  } catch (error) {
    console.log('[GENERATIONS_GET]', error)
    return NextResponse.json([])
  }
}