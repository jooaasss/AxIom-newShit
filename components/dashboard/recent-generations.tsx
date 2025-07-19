'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import Link from 'next/link'
import { toast } from 'sonner'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'
import { FileText, Code, Image, Globe, Sparkles, History, Clock, ArrowRight } from 'lucide-react'

type Generation = {
  id: string
  type: 'text' | 'code' | 'image' | 'website'
  prompt: string
  createdAt: string
}

export function RecentGenerations() {
  const [generations, setGenerations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchGenerations = async () => {
    setIsLoading(true)
    
    const result = await makeApiRequest(
      () => apiClient.get('/api/generations?limit=5'),
      {
        context: 'Fetch recent generations',
        customErrorMessage: 'Не удалось загрузить последние генерации',
      }
    )
    
    setIsLoading(false)
    
    if (result) {
      setGenerations(result.data)
    }
  }

  useEffect(() => {
    fetchGenerations()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />
      case 'code': return <Code className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" />
      case 'website': return <Globe className="h-4 w-4" />
      default: return <Sparkles className="h-4 w-4" />
    }
  }

  const getTypeColors = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
      case 'code': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
      case 'image': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800'
      case 'website': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800'
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-800'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Последние генерации</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (generations.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="flex h-40 flex-col items-center justify-center text-center">
          <History className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm font-medium text-muted-foreground mb-1">No generations yet</p>
          <p className="text-sm text-muted-foreground">Your recent AI generations will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            {generations.map((generation, index) => (
              <div key={generation.id} className="group">
                <Link href={`/history/${generation.id}`} className="block">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all duration-200 group-hover:scale-[1.01]">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getTypeColors(generation.type)}`}>
                          {getTypeIcon(generation.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant="outline" 
                            className={`capitalize text-sm ${getTypeColors(generation.type)}`}
                          >
                            {generation.type} Generation
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true, locale: ru })}
                          </div>
                        </div>
                        
                        <p className="text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {generation.prompt}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
                
                {index < generations.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button variant="outline" size="lg" asChild className="group">
          <Link href="/history">
            <History className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
            View All Generations
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  )
}