'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/loader'
import { Search, Sparkles, Globe, Brain } from 'lucide-react'
import { toast } from 'sonner'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      toast.error('Пожалуйста, введите поисковый запрос')
      return
    }

    setIsLoading(true)
    
    try {
      // Здесь будет логика поиска с ИИ
      // Пока что показываем заглушку
      setTimeout(() => {
        setResults([
          {
            id: 1,
            title: 'AI-powered search result',
            description: 'This is a sample search result powered by artificial intelligence.',
            url: '#'
          }
        ])
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      toast.error('Ошибка при выполнении поиска')
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Поиск с ИИ</h1>
          <p className="text-muted-foreground">
            Получите интеллектуальные результаты поиска и ответы с помощью передовых технологий ИИ
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Умный поиск
            </CardTitle>
            <CardDescription>
              Задайте любой вопрос или введите поисковый запрос
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                placeholder="Введите ваш вопрос или поисковый запрос..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !query.trim()}>
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4" />
                    Поиск...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Найти
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Результаты поиска
            </h2>
            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{result.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{result.description}</p>
                      <div className="text-xs text-muted-foreground">
                        Результат получен с помощью ИИ
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && results.length === 0 && query && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Результаты не найдены</h3>
              <p className="text-muted-foreground">
                Попробуйте изменить поисковый запрос или задать вопрос по-другому
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}