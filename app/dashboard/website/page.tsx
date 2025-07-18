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

export default function WebsitePage() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      toast.error('Пожалуйста, введите описание веб-сайта')
      return
    }

    setIsLoading(true)
    
    const result = await makeApiRequest(
      () => apiClient.post('/api/generations/website', { prompt }),
      {
        context: 'Website generation',
        customErrorMessage: 'Не удалось сгенерировать веб-сайт. Попробуйте еще раз.',
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
          <CardTitle>Генерация веб-сайта</CardTitle>
          <CardDescription>
            Опишите веб-сайт, который хотите создать, и мы сгенерируем его для вас.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Описание веб-сайта
              </label>
              <Textarea
                id="prompt"
                placeholder="Опишите веб-сайт, который хотите создать..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full">
             {isLoading ? (<>
                  <Loader className="mr-2 h-4 w-4" />
                  Генерация...              </>
              ) : (
                'Сгенерировать веб-сайт'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}