'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Loader } from '@/components/loader'
import { toast } from 'sonner'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'
import { ProviderSelector } from '@/components/dashboard/provider-selector'
import { ProviderAvatar } from '@/components/ui/provider-avatar'
import { Copy, User, Bot } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUser } from '@clerk/nextjs'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'error'
  content: string
  timestamp: Date
}

export default function TextPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      toast.error('Пожалуйста, введите запрос для генерации текста')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setPrompt('')
    
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
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.data.content || '',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      toast.success('Текст успешно сгенерирован!')
    } else {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: 'Не удалось сгенерировать текст. Попробуйте еще раз.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Скопировано в буфер обмена')
  }

  const handleClearChat = () => {
    setMessages([])
    setPrompt('')
  }

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    // Не отправляем автоматический запрос при смене провайдера
  }

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    // Не отправляем автоматический запрос при смене модели
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
        {/* Селектор провайдеров - слева */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Настройки ИИ</CardTitle>
              <CardDescription>
                Выберите провайдера и модель для генерации текста
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProviderSelector
                type="text"
                selectedProvider={selectedProvider}
                selectedModel={selectedModel}
                onProviderChange={handleProviderChange}
                onModelChange={handleModelChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Объединенное окно запроса и ответа - справа */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Генерация текста</CardTitle>
                  <CardDescription>
                    Введите ваш запрос и получите сгенерированный текст
                  </CardDescription>
                </div>
                {messages.length > 0 && (
                  <Button variant="outline" onClick={handleClearChat}>
                    Очистить чат
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col space-y-4">
              {/* Область сообщений с фиксированной высотой */}
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-[400px] border rounded-lg bg-muted/30">
                  <div className="p-3 space-y-2">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                        Начните диалог с ИИ
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {message.type !== 'user' && (
                            message.type === 'error' ? (
                              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                                <Bot className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              <ProviderAvatar provider={selectedProvider} size="sm" />
                            )
                          )}
                          <div className={`max-w-[75%] rounded-lg p-2 relative group ${
                            message.type === 'user' 
                              ? 'bg-primary text-primary-foreground ml-auto' 
                              : message.type === 'error'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-background border'
                          }`}>
                            <div className="whitespace-pre-wrap text-xs leading-relaxed">
                              {message.content}
                            </div>
                            {message.type !== 'user' && message.type !== 'error' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopy(message.content)}
                                className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity"
                              >
                                <Copy className="h-2.5 w-2.5" />
                              </Button>
                            )}
                          </div>
                          {message.type === 'user' && (
                            user?.imageUrl ? (
                              <img 
                                src={user.imageUrl} 
                                alt="User avatar"
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                <User className="w-3 h-3 text-white" />
                              </div>
                            )
                          )}
                        </div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex gap-2 justify-start">
                        <ProviderAvatar provider={selectedProvider} size="sm" />
                        <div className="bg-background border rounded-lg p-2">
                          <div className="flex items-center gap-2">
                            <Loader className="h-3 w-3 animate-spin" />
                            <span className="text-xs text-muted-foreground">Генерирую ответ...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>
              
              {/* Форма ввода снизу */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Textarea
                    id="prompt"
                    placeholder="Введите ваш запрос для генерации текста..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    disabled={isLoading}
                    className="resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                </div>
                <Button type="submit" disabled={isLoading || !prompt.trim() || !selectedProvider} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4" />
                      Генерация...
                    </>
                  ) : (
                    'Сгенерировать текст'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}