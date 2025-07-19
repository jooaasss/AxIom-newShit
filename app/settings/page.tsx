'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/loader'
import { toast } from 'sonner'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'
import { CreditsDisplay } from '@/components/dashboard/credits'
import { Eye, EyeOff, Trash2, Key, Check, X } from 'lucide-react'

interface UserAPIKey {
  id: string
  provider: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', placeholder: 'sk-...' },
  { id: 'groq', name: 'Groq', placeholder: 'gsk_...' },
  { id: 'google', name: 'Google Gemini', placeholder: 'AI...' },
  { id: 'cohere', name: 'Cohere', placeholder: 'co-...' },
  { id: 'huggingface', name: 'Hugging Face', placeholder: 'hf_...' },
  { id: 'grok', name: 'Grok', placeholder: 'xai-...' },
  { id: 'deepseek', name: 'DeepSeek', placeholder: 'sk-...' }
]

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeys, setApiKeys] = useState<UserAPIKey[]>([])
  const [newApiKeys, setNewApiKeys] = useState<Record<string, string>>({})
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const [loadingApiKeys, setLoadingApiKeys] = useState(true)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    const result = await makeApiRequest(
      () => apiClient.get('/api/user/api-keys'),
      {
        context: 'Loading API keys',
        customErrorMessage: 'Не удалось загрузить API ключи.',
      }
    )
    
    setLoadingApiKeys(false)
    
    if (result) {
      setApiKeys(result.data.apiKeys)
    }
  }

  const handleSaveApiKey = async (provider: string) => {
    const apiKey = newApiKeys[provider]
    if (!apiKey || !apiKey.trim()) {
      toast.error('Введите API ключ')
      return
    }

    setIsLoading(true)
    const result = await makeApiRequest(
      () => apiClient.post('/api/user/api-keys', { provider, apiKey: apiKey.trim() }),
      {
        context: 'Saving API key',
        customErrorMessage: 'Не удалось сохранить API ключ.',
      }
    )
    
    if (result) {
      toast.success('API ключ сохранен')
      setNewApiKeys(prev => ({ ...prev, [provider]: '' }))
      await fetchApiKeys()
    }
    setIsLoading(false)
  }

  const handleDeleteApiKey = async (provider: string) => {
    setIsLoading(true)
    const result = await makeApiRequest(
      () => apiClient.delete(`/api/user/api-keys?provider=${provider}`),
      {
        context: 'Deleting API key',
        customErrorMessage: 'Не удалось удалить API ключ.',
      }
    )
    
    if (result) {
      toast.success('API ключ удален')
      await fetchApiKeys()
    }
    setIsLoading(false)
  }

  const toggleShowApiKey = (provider: string) => {
    setShowApiKeys(prev => ({ ...prev, [provider]: !prev[provider] }))
  }

  const handleSubscription = async () => {
    setIsLoading(true)
    const result = await makeApiRequest(
      () => apiClient.get('/api/stripe'),
      {
        context: 'Getting subscription URL',
        customErrorMessage: 'Не удалось получить ссылку на подписку. Попробуйте еще раз.',
      }
    )
    
    if (result) {
      window.location.href = result.data.url
    }
    setIsLoading(false)
  }

  const handleBuyCredits = async (amount: number) => {
    setIsLoading(true)
    const result = await makeApiRequest(
      () => apiClient.post('/api/stripe/credits', { amount }),
      {
        context: 'Purchasing credits',
        customErrorMessage: 'Не удалось приобрести кредиты. Попробуйте еще раз.',
      }
    )
    
    if (result) {
      window.location.href = result.data.url
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <CreditsDisplay />
      </div>
      
      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Your API Keys
              </CardTitle>
              <CardDescription>
                Configure your own AI provider API keys. When you use your own keys, site credits won't be consumed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingApiKeys ? (
                <div className="flex items-center justify-center p-8">
                  <Loader className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading API keys...</span>
                </div>
              ) : (
                <div className="grid gap-4">
                  {PROVIDERS.map((provider) => {
                    const existingKey = apiKeys.find(key => key.provider === provider.id)
                    const hasKey = !!existingKey
                    
                    return (
                      <Card key={provider.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium">{provider.name}</h4>
                            {hasKey ? (
                              <Badge variant="default" className="flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Configured
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <X className="h-3 w-3" />
                                Not configured
                              </Badge>
                            )}
                          </div>
                          {hasKey && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteApiKey(provider.id)}
                              disabled={isLoading}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        {!hasKey && (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Input
                                  type={showApiKeys[provider.id] ? 'text' : 'password'}
                                  placeholder={provider.placeholder}
                                  value={newApiKeys[provider.id] || ''}
                                  onChange={(e) => setNewApiKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                                />
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => toggleShowApiKey(provider.id)}
                              >
                                {showApiKeys[provider.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button
                                onClick={() => handleSaveApiKey(provider.id)}
                                disabled={isLoading || !newApiKeys[provider.id]?.trim()}
                              >
                                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Save'}
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {hasKey && (
                          <div className="text-sm text-muted-foreground">
                            Last updated: {new Date(existingKey.updatedAt).toLocaleDateString()}
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-6">
          <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Upgrade to Pro for unlimited AI generations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pro subscription includes:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
              <li>Unlimited AI generations</li>
              <li>Priority processing</li>
              <li>Advanced customization options</li>
              <li>Early access to new features</li>
            </ul>
            <p className="mt-4 font-medium">
              $20/month
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubscription} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader className="mr-2" /> : null}
              Upgrade to Pro
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buy Credits</CardTitle>
            <CardDescription>
              Purchase credits for pay-as-you-go usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Credits are used for AI generations:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
              <li>Text generation: 1 credit</li>
              <li>Code generation: 2 credits</li>
              <li>Image generation: 3 credits</li>
              <li>Website generation: 5 credits</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={() => handleBuyCredits(100)} 
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              100 Credits - $10
            </Button>
            <Button 
              onClick={() => handleBuyCredits(500)} 
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              500 Credits - $40 (20% off)
            </Button>
            <Button 
              onClick={() => handleBuyCredits(1000)} 
              disabled={isLoading}
              className="w-full"
            >
              1000 Credits - $70 (30% off)
            </Button>
          </CardFooter>
        </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}