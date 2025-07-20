import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!prisma) {
      return new NextResponse('Database connection not available', { status: 500 })
    }

    const generation = await prisma.generation.findUnique({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!generation) {
      return new NextResponse('Generation not found', { status: 404 })
    }

    return NextResponse.json(generation)
  } catch (error) {
    console.log('[GENERATION_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}