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
    
    let availableProviders: AIProvider[]
    
    if (apiType === 'user') {
      // Получаем пользовательские API ключи
      const userApiKeys = await prisma.userAPIKey.findMany({
        where: {
          userId: userId,
          isActive: true
        }
      })
      
      // Фильтруем провайдеров по наличию пользовательских ключей
      const userProviders = userApiKeys.map(key => key.provider as AIProvider)
      availableProviders = userProviders
    } else {
      // Используем сервисные API ключи
      availableProviders = getAvailableProviders()
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