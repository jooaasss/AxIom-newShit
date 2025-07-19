import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getAvailableProviders, getProviderModels, PROVIDER_INFO, type AIProvider } from '@/lib/ai-providers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const type = url.searchParams.get('type') as 'text' | 'image' || 'text'
    const apiType = url.searchParams.get('apiType') as 'service' | 'user' || 'service'
    
    let availableProviders: AIProvider[] = []
    
    if (apiType === 'service') {
      // Use service API keys (environment variables)
      availableProviders = getAvailableProviders()
    } else {
      // Use user API keys from database
      const userApiKeys = await prisma.userAPIKey.findMany({
        where: { userId },
        select: { provider: true }
      })
      availableProviders = userApiKeys.map((key: { provider: string }) => key.provider as AIProvider)
    }
    
    const providers = availableProviders.map((provider: AIProvider) => {
      const models = getProviderModels(provider, type)
      const info = PROVIDER_INFO[provider]
      
      return {
        id: provider,
        name: info.name,
        description: info.description,
        icon: info.icon,
        color: info.color,
        models,
        available: models.length > 0,
      }
    }).filter(provider => provider.available)

    return NextResponse.json({ providers })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}