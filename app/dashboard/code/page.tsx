'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader } from '@/components/loader'
import { toast } from 'sonner'
import { Bot, User } from 'lucide-react'
import { ProviderAvatar } from '@/components/ui/provider-avatar'
import { TextContainer } from '@/components/ui/text-container'
import { useChatHistory, type Message } from '@/hooks/use-chat-history'
import { useUser } from '@clerk/nextjs'
import { makeApiRequest } from '@/lib/axios-interceptor'

export default function CodePage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  // Фиксированные значения для GitHub Models Llama
  const selectedProvider = 'github'
  const selectedModel = 'Meta-Llama-3.1-8B-Instruct'
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

  // Удалены обработчики изменения провайдера и модели

  const handleClearChat = () => {
    clearMessages(selectedProvider, selectedModel)
    toast.success('Чат очищен')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      toast.error('Пожалуйста, введите описание кода')
      return
    }

    if (!selectedProvider || !selectedModel) {
      toast.error('Пожалуйста, выберите провайдера и модель')
      return
    }

    // Добавляем специализированный промпт для программирования
    const codePrompt = `Ты - эксперт по программированию и специалист по написанию кода. Твоя задача - создавать чистый, эффективный и хорошо документированный код на основе требований пользователя. Всегда следуй лучшим практикам программирования и добавляй комментарии к коду.\n\nЗапрос пользователя: ${prompt}`

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

    try {
      const response = await fetch('/api/generate/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: codePrompt,
          provider: selectedProvider,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const endTime = Date.now()
      const responseTimeMs = endTime - startTime
      setResponseTime(`${(responseTimeMs / 1000).toFixed(2)}s`)

      if (data.content) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.content,
          timestamp: new Date()
        }
        addMessage(selectedProvider, selectedModel, assistantMessage)
        toast.success('Код успешно сгенерирован!')
      } else {
        throw new Error(data.error || 'Неизвестная ошибка')
      }
    } catch (error: any) {
      console.error('Ошибка генерации:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: error.message || 'Произошла ошибка при генерации кода',
        timestamp: new Date()
      }
      addMessage(selectedProvider, selectedModel, errorMessage)
      toast.error('Ошибка генерации кода')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
        {/* Окно генерации кода */}
        <div className="lg:col-span-12">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Генерация кода</CardTitle>
                  <CardDescription>
                    Опишите код, который вы хотите сгенерировать • Powered by Llama via GitHub Models
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
                          Начните диалог с ИИ для генерации кода
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
                              <div className={`max-w-[80%] p-3 rounded-lg ${
                                message.type === 'user' 
                                  ? 'bg-primary text-primary-foreground ml-auto' 
                                  : 'bg-destructive/10 text-destructive border border-destructive/20'
                              }`}>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <div className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            )}
                            {message.type === 'user' && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                                <User className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        ))
                      )}
                      {loading && (
                        <div className="flex gap-2 justify-start">
                          <ProviderAvatar provider={selectedProvider} size="sm" />
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Loader className="w-4 h-4 animate-spin" />
                              <span className="text-sm text-muted-foreground">Генерирую код...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>
              </div>
              
              {/* Форма ввода */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Пример: Создай функцию для сортировки массива объектов по дате, реализуй алгоритм бинарного поиска, создай REST API endpoint..."
                  rows={3}
                  disabled={loading}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={loading || !prompt.trim()}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Генерирую...
                      </>
                    ) : (
                      'Сгенерировать код'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}