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

export default function CodePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      toast.error('Пожалуйста, введите описание кода')
      return
    }

    setIsLoading(true)
    
    const result = await makeApiRequest(
      () => apiClient.post('/api/generations/code', { prompt }),
      {
        context: 'Code generation',
        customErrorMessage: 'Не удалось сгенерировать код. Попробуйте еще раз.',
      }
    )
    
    setIsLoading(false)
    
    if (result) {
      router.push(`/history/${result.data.id}`)
    }
  }

  return (
    <div className="container mx-auto py-10">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Генерация кода</CardTitle>
            <CardDescription>
              Опишите, какой код вы хотите сгенерировать, и ИИ создаст его для вас.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="prompt" className="text-sm font-medium">
                  Описание кода
                </label>
                <Textarea
                  id="prompt"
                  placeholder="Например: Создай функцию для сортировки массива объектов по дате..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader className="mr-2" />
                    Генерация...
                  </>
                ) : (
                  'Сгенерировать код'
                )}
              </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}