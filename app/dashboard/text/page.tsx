'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Loader } from '@/components/loader'
import { toast } from 'sonner'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'
import { ProviderSelector } from '@/components/dashboard/provider-selector'

export default function TextPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      toast.error('Пожалуйста, введите запрос для генерации текста')
      return
    }

    setIsLoading(true)
    
    const result = await makeApiRequest(
      () => apiClient.post('/api/generate/text', { 
        prompt,
        provider: selectedProvider,
        model: selectedModel,
      }),
      {
        context: 'Text generation',
        customErrorMessage: 'Не удалось сгенерировать текст. Попробуйте еще раз.',
      }
    )
    
    setIsLoading(false)
    
    if (result) {
      router.push(`/history/${result.data.id}`)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Генерация текста</CardTitle>
          <CardDescription>
            Введите запрос и мы сгенерируем текстовый контент для вас.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Запрос для генерации текста
              </label>
              <Textarea
                id="prompt"
                placeholder="Введите ваш запрос для генерации текста..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={isLoading}
              />
            </div>
            <ProviderSelector
              type="text"
              selectedProvider={selectedProvider}
              selectedModel={selectedModel}
              onProviderChange={setSelectedProvider}
              onModelChange={setSelectedModel}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4" />
                  Генерация...
                </>
              ) : (
                'Сгенерировать текст'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}