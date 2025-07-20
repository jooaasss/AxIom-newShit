import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getAvailableProviders, getAIProvider, PROVIDER_INFO, type AIProvider } from '@/lib/ai-providers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface ProviderStatus {
  id: string
  name: string
  available: boolean
  error?: string
}

async function checkProviderStatus(provider: AIProvider, userApiKey?: string): Promise<{ available: boolean; error?: string }> {
  try {
    // For service API keys, check if environment variable exists
    if (!userApiKey) {
      const envKey = getEnvKeyForProvider(provider)
      if (!process.env[envKey]) {
        return { available: false, error: 'API key not configured' }
      }
    }

    // For now, just check if the provider is configured
    // In the future, we can add actual API calls to test connectivity
    const aiProvider = getAIProvider(provider)
    if (!aiProvider) {
      return { available: false, error: 'Provider not initialized' }
    }

    return { available: true }
  } catch (error: any) {
    return { 
      available: false, 
      error: error.message || 'Connection failed'
    }
  }
}

function getEnvKeyForProvider(provider: AIProvider): string {
  const envKeys: Record<AIProvider, string> = {
    openai: 'OPENAI_API_KEY',
    groq: 'GROQ_API_KEY',
    gemini: 'GOOGLE_GEMINI_API_KEY',
    cohere: 'COHERE_API_KEY',
    huggingface: 'HUGGINGFACE_API_KEY',
    grok: 'GROK_API_KEY',
    deepseek: 'DEEPSEEK_API_KEY'
  }
  return envKeys[provider]
}

function getDefaultModel(provider: AIProvider): string {
  const defaultModels: Record<AIProvider, string> = {
    openai: 'gpt-4o-mini',
    groq: 'llama-3.1-8b-instant',
    gemini: 'gemini-1.5-flash',
    cohere: 'command-r',
    huggingface: 'meta-llama/Llama-2-70b-chat-hf',
    grok: 'grok-beta',
    deepseek: 'deepseek-chat'
  }
  return defaultModels[provider]
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const apiType = url.searchParams.get('apiType') as 'service' | 'user' || 'service'
    
    let providersToCheck: AIProvider[] = []
    let userApiKeys: Record<string, string> = {}
    
    if (apiType === 'service') {
      // Check service API keys (environment variables)
      providersToCheck = getAvailableProviders()
    } else {
      if (!prisma) {
        return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
      }
      // Check user API keys from database
      const userKeys = await prisma.userAPIKey.findMany({
        where: { userId },
        select: { provider: true }
      })
      providersToCheck = userKeys.map(key => key.provider as AIProvider)
    }

    // Check status for each provider
    const statusChecks = await Promise.allSettled(
      providersToCheck.map(async (provider) => {
        const userKey = userApiKeys[provider]
        const status = await checkProviderStatus(provider, userKey)
        const info = PROVIDER_INFO[provider]
        
        return {
          id: provider,
          name: info.name,
          available: status.available,
          error: status.error
        } as ProviderStatus
      })
    )

    const results = statusChecks.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        const provider = providersToCheck[index]
        const info = PROVIDER_INFO[provider]
        return {
          id: provider,
          name: info.name,
          available: false,
          error: 'Status check failed'
        } as ProviderStatus
      }
    })

    return NextResponse.json({ providers: results })

  } catch (error) {
    console.error('Provider status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}