'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader, ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

interface Provider {
  id: string
  name: string
  description: string
  icon: string
  color: string
  models: string[]
  available: boolean
}

interface ProviderStatus {
  textProviders: Provider[]
  imageProviders: Provider[]
  loading: boolean
}

export default function ProvidersPage() {
  const { toast } = useToast()
  const [status, setStatus] = useState<ProviderStatus>({
    textProviders: [],
    imageProviders: [],
    loading: true,
  })

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const [textResponse, imageResponse] = await Promise.all([
          axios.get('/api/providers?type=text'),
          axios.get('/api/providers?type=image'),
        ])

        setStatus({
          textProviders: textResponse.data.providers,
          imageProviders: imageResponse.data.providers,
          loading: false,
        })
      } catch (error) {
        console.error('Failed to fetch providers:', error)
        toast({
          title: 'Error',
          description: 'Failed to load AI providers',
          variant: 'destructive',
        })
        setStatus(prev => ({ ...prev, loading: false }))
      }
    }

    fetchProviders()
  }, [])

  const testProvider = async (providerId: string, type: 'text' | 'image') => {
    try {
      const testPrompt = type === 'text' 
        ? 'Hello, this is a test message.'
        : 'A simple test image of a blue sky'
      
      const response = await axios.post(`/api/generate/${type}`, {
        prompt: testPrompt,
        provider: providerId,
      })

      toast({
        title: 'Success',
        description: `${providerId} provider is working correctly!`,
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || `Failed to test ${providerId}`,
        variant: 'destructive',
      })
    }
  }

  const ProviderCard = ({ provider, type }: { provider: Provider; type: 'text' | 'image' }) => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center text-white text-xl`}>
              {provider.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{provider.name}</CardTitle>
              <CardDescription>{provider.description}</CardDescription>
            </div>
          </div>
          {provider.available ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Available Models ({provider.models.length})</h4>
          <div className="flex flex-wrap gap-1">
            {provider.models.slice(0, 3).map((model) => (
              <Badge key={model} variant="secondary" className="text-xs">
                {model}
              </Badge>
            ))}
            {provider.models.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{provider.models.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => testProvider(provider.id, type)}
            disabled={!provider.available}
          >
            Test Provider
          </Button>
          <Button size="sm" asChild disabled={!provider.available}>
            <Link href={`/dashboard/${type}`}>
              Use Now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (status.loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center p-8">
          <Loader className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-lg">Loading AI providers...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Providers</h1>
        <p className="text-muted-foreground">
          Manage and test your AI provider integrations. Configure API keys in your environment variables.
        </p>
      </div>

      {/* Provider Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Text Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.textProviders.length}</div>
            <p className="text-xs text-muted-foreground">
              {status.textProviders.filter(p => p.available).length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Image Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.imageProviders.length}</div>
            <p className="text-xs text-muted-foreground">
              {status.imageProviders.filter(p => p.available).length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {[...status.textProviders, ...status.imageProviders].reduce(
                (acc, provider) => acc + provider.models.length,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Available models</p>
          </CardContent>
        </Card>
      </div>

      {/* Text Generation Providers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Text Generation</h2>
          <Badge variant="outline">{status.textProviders.length} providers</Badge>
        </div>
        
        {status.textProviders.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {status.textProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} type="text" />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No text generation providers configured. Please add API keys to your environment variables.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Image Generation Providers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Image Generation</h2>
          <Badge variant="outline">{status.imageProviders.length} providers</Badge>
        </div>
        
        {status.imageProviders.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {status.imageProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} type="image" />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No image generation providers configured. Please add API keys to your environment variables.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Setup Instructions</span>
            <ExternalLink className="h-4 w-4" />
          </CardTitle>
          <CardDescription>
            Configure your AI provider API keys in environment variables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Environment Variables</h4>
              <div className="space-y-1 text-sm font-mono bg-muted p-3 rounded">
                <div>OPENAI_API_KEY=your_openai_key</div>
                <div>GROQ_API_KEY=your_groq_key</div>
                <div>GOOGLE_GEMINI_API_KEY=your_gemini_key</div>
                <div>COHERE_API_KEY=your_cohere_key</div>
                <div>HUGGINGFACE_API_KEY=your_hf_key</div>
                <div>GROK_API_KEY=your_grok_key</div>
                <div>DEEPSEEK_API_KEY=your_deepseek_key</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Provider Links</h4>
              <div className="space-y-2 text-sm">
                <div>• OpenAI: <a href="https://platform.openai.com/" target="_blank" className="text-blue-500 hover:underline">platform.openai.com</a></div>
                <div>• Groq: <a href="https://console.groq.com/" target="_blank" className="text-blue-500 hover:underline">console.groq.com</a></div>
                <div>• Google Gemini: <a href="https://aistudio.google.com/" target="_blank" className="text-blue-500 hover:underline">aistudio.google.com</a></div>
                <div>• Cohere: <a href="https://dashboard.cohere.com/" target="_blank" className="text-blue-500 hover:underline">dashboard.cohere.com</a></div>
                <div>• Hugging Face: <a href="https://huggingface.co/" target="_blank" className="text-blue-500 hover:underline">huggingface.co</a></div>
                <div>• Grok: <a href="https://x.ai/" target="_blank" className="text-blue-500 hover:underline">x.ai</a></div>
                <div>• DeepSeek: <a href="https://platform.deepseek.com/" target="_blank" className="text-blue-500 hover:underline">platform.deepseek.com</a></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}