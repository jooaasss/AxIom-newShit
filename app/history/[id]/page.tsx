'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Copy, Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

type Generation = {
  id: string
  type: 'text' | 'code' | 'image' | 'search'
  prompt: string
  output: string
  createdAt: string
  metadata?: string
}

export default function GenerationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [generation, setGeneration] = useState<Generation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGeneration = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/generations/${params.id}`)
        setGeneration(response.data)
      } catch (error) {
        console.error('Failed to fetch generation:', error)
        toast.error('Failed to load generation')
        router.push('/history')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchGeneration()
    }
  }, [params.id, router])

  const handleCopy = () => {
    if (!generation) return
    
    navigator.clipboard.writeText(generation.output)
    toast.success('Copied to clipboard')
  }

  const handleDownload = () => {
    if (!generation) return
    
    let filename = `generation-${generation.id}`
    let content = generation.output
    let type = 'text/plain'
    
    if (generation.type === 'image') {
      filename += '.png'
      // For images, we need to create a link to download the image
      const link = document.createElement('a')
      link.href = generation.output
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    } else if (generation.type === 'code') {
      filename += '.txt'
    } else if (generation.type === 'search') {
      filename += '.txt'
      type = 'text/plain'
    } else {
      filename += '.txt'
    }
    
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Downloaded successfully')
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!generation) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Button variant="ghost" onClick={() => router.push('/history')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Generation not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Button variant="ghost" onClick={() => router.push('/history')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to History
      </Button>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prompt</CardTitle>
            <Badge
              variant="outline"
              className={`capitalize ${generation.type === 'text' ? 'bg-blue-100 text-blue-800' : ''} ${generation.type === 'code' ? 'bg-purple-100 text-purple-800' : ''} ${generation.type === 'image' ? 'bg-green-100 text-green-800' : ''} ${generation.type === 'search' ? 'bg-orange-100 text-orange-800' : ''}`}
            >
              {generation.type}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{generation.prompt}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Created on {formatDate(new Date(generation.createdAt))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Output</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {generation.type === 'image' ? (
              <div className="flex justify-center">
                <div className="relative w-full max-w-lg aspect-square">
                  <Image 
                    src={generation.output} 
                    alt="Generated image" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              </div>
            ) : generation.type === 'code' ? (
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{generation.output}</code>
              </pre>
            ) : generation.type === 'search' ? (
              <div className="bg-muted p-4 rounded-md">
                <p className="whitespace-pre-wrap">{generation.output}</p>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{generation.output}</p>
            )}
          </CardContent>
        </Card>

        {generation.metadata && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{JSON.stringify(JSON.parse(generation.metadata), null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}