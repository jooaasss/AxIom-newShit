import { NextResponse } from 'next/server'
import { checkAdminAccess, adminApiResponse } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// Get all AI provider keys
export async function GET() {
  try {
    const { isAdmin, error } = await checkAdminAccess()
    
    if (!isAdmin) {
      return adminApiResponse(error || 'Admin access required')
    }

    const providers = await prisma.aIProviderKey.findMany({
      select: {
        id: true,
        provider: true,
        apiKey: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        provider: 'asc'
      }
    })

    // Mask API keys for security (show only first 8 and last 4 characters)
    const maskedProviders = providers.map((p: any) => ({
      ...p,
      apiKey: p.apiKey.length > 12 
        ? `${p.apiKey.substring(0, 8)}...${p.apiKey.substring(p.apiKey.length - 4)}`
        : '***masked***'
    }))

    return NextResponse.json(maskedProviders)
  } catch (error) {
    console.error('[ADMIN_PROVIDERS_GET]', error)
    return adminApiResponse('Internal Error', 500)
  }
}

// Create or update AI provider key
export async function POST(req: Request) {
  try {
    const { isAdmin, error } = await checkAdminAccess()
    
    if (!isAdmin) {
      return adminApiResponse(error || 'Admin access required')
    }

    const body = await req.json()
    const { provider, apiKey, isActive = true } = body

    if (!provider || !apiKey) {
      return adminApiResponse('Provider and API key are required', 400)
    }

    // Valid providers
    const validProviders = ['openai', 'groq', 'huggingface', 'gemini', 'cohere', 'grok', 'deepseek']
    if (!validProviders.includes(provider)) {
      return adminApiResponse('Invalid provider', 400)
    }

    const providerKey = await prisma.aIProviderKey.upsert({
      where: { provider },
      update: {
        apiKey,
        isActive,
        updatedAt: new Date()
      },
      create: {
        provider,
        apiKey,
        isActive
      }
    })

    // Return masked API key
    const maskedProviderKey = {
      ...providerKey,
      apiKey: apiKey.length > 12 
        ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
        : '***masked***'
    }

    return NextResponse.json(maskedProviderKey)
  } catch (error) {
    console.error('[ADMIN_PROVIDERS_POST]', error)
    return adminApiResponse('Internal Error', 500)
  }
}

// Delete AI provider key
export async function DELETE(req: Request) {
  try {
    const { isAdmin, error } = await checkAdminAccess()
    
    if (!isAdmin) {
      return adminApiResponse(error || 'Admin access required')
    }

    const { searchParams } = new URL(req.url)
    const providerId = searchParams.get('id')

    if (!providerId) {
      return adminApiResponse('Provider ID is required', 400)
    }

    await prisma.aIProviderKey.delete({
      where: { id: providerId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ADMIN_PROVIDERS_DELETE]', error)
    return adminApiResponse('Internal Error', 500)
  }
}