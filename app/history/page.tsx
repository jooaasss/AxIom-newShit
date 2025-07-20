'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/loader'
import { formatDistanceToNow, format } from 'date-fns'
import { ru } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'

export const dynamic = 'force-dynamic'

type Generation = {
  id: string
  type: 'text' | 'code' | 'image' | 'website'
  prompt: string
  createdAt: string
}

export default function HistoryPage() {
  const [generations, setGenerations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchGenerations = async () => {
    setIsLoading(true)
    
    const result = await makeApiRequest(
      () => apiClient.get('/api/generations'),
      {
        context: 'Fetch generations history',
        customErrorMessage: 'Не удалось загрузить историю генераций',
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Generation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center">
              <Loader />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }



  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Generation History</CardTitle>
        </CardHeader>
        <CardContent>
          {generations.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
              <p className="text-sm text-muted-foreground">No generations yet</p>
              <p className="text-xs text-muted-foreground">Your generations will appear here</p>
              <Button className="mt-4" onClick={() => router.push('/dashboard')}>
                Create your first generation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <ul className="divide-y">
                {generations.map((generation) => (
                  <li key={generation.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`capitalize ${
                              generation.type === 'text' ? 'bg-blue-100 text-blue-800' : ''
                            } ${
                              generation.type === 'code' ? 'bg-purple-100 text-purple-800' : ''
                            } ${
                              generation.type === 'image' ? 'bg-green-100 text-green-800' : ''
                            } ${
                              generation.type === 'website' ? 'bg-orange-100 text-orange-800' : ''
                            }`}
                          >
                            {generation.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(generation.createdAt), 'dd.MM.yyyy HH:mm')}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{generation.prompt}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/history/${generation.id}`}>
                          <span className="sr-only">View details</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}