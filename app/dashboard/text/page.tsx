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
import { useChatHistory, type Message } from '@/hooks/use-chat-history'
import { TextContainer } from '@/components/ui/text-container'

export default function TextPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [responseTime, setResponseTime] = useState<string | undefined>(undefined)
  const { getMessages, addMessage, addMessages, clearMessages } = useChatHistory()
  
  // Получаем сообщения для текущего провайдера и модели
  const messages = getMessages(selectedProvider, selectedModel)
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

    addMessage(selectedProvider, selectedModel, userMessage)
    setLoading(true)
    setPrompt('')
    
    const startTime = Date.now()
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
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(1)
    setResponseTime(`${duration}s`)
    
    setLoading(false)
    
    if (result) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.data.content || '',
        timestamp: new Date()
      }
      addMessage(selectedProvider, selectedModel, assistantMessage)
      toast.success('Текст успешно сгенерирован!')
    } else {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: 'Не удалось сгенерировать текст. Попробуйте еще раз.',
        timestamp: new Date()
      }
      addMessage(selectedProvider, selectedModel, errorMessage)
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Скопировано в буфер обмена')
  }

  const handleClearChat = () => {
    clearMessages(selectedProvider, selectedModel)
    setPrompt('')
    toast.success('Chat history cleared')
  }

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    setLoading(false) // Сбрасываем состояние загрузки при смене провайдера
    // Не отправляем автоматический запрос при смене провайдера
  }

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    setLoading(false) // Сбрасываем состояние загрузки при смене модели
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
              {/* Область сообщений */}
              <div className="flex-1">
                <div className="border border-muted/50 rounded-lg bg-muted/30 h-[600px]">
                  <ScrollArea className="h-full p-3">
                    <div className="space-y-2">
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
                            {message.type === 'assistant' ? (
                              <div className="max-w-[80%] flex-1">
                                <TextContainer
                  title=""
                  content={message.content}
                  showSlider={false}
                  showCopyButton={true}
                  className="mb-2 border-0 shadow-none bg-background"
                  responseTime={responseTime}
                />
                                <div className="text-sm text-muted-foreground ml-4">
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            ) : (
                              <div className={`max-w-[75%] rounded-lg p-2 relative group ${
                                message.type === 'user' 
                                  ? 'bg-primary text-primary-foreground ml-auto' 
                                  : message.type === 'error'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-background border border-muted/50'
                              }`}>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                  {message.content}
                                </div>
                              </div>
                            )}
                            {message.type === 'user' && (
                              user?.imageUrl ? (
                                <img
                                  src={user.imageUrl}
                  alt="User avatar"
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0">
                                  <span className="text-sm text-primary-foreground font-medium">
                                    {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || 'U'}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        ))
                      )}
                      {loading && (
                        <div className="flex gap-2 justify-start">
                          <ProviderAvatar provider={selectedProvider} size="sm" />
                          <div className="bg-background border border-muted/50 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <Loader className="h-3 w-3 animate-spin" />
                              <span className="text-sm text-muted-foreground">Генерирую ответ...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>
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
                    disabled={loading}
                    className="resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                </div>
                <Button type="submit" disabled={loading || !prompt.trim() || !selectedProvider} className="w-full">
                  {loading ? (
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