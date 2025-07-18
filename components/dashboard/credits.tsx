'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Coins, Plus, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export function CreditsDisplay() {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await axios.get('/api/user/credits')
        setCredits(response.data.credits)
      } catch (error) {
        console.error('Failed to fetch credits:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCredits()
  }, [])

  const getCreditsStatus = () => {
    if (credits === null) return { color: 'text-gray-500', status: 'Loading' }
    if (credits >= 50) return { color: 'text-green-600', status: 'Excellent' }
    if (credits >= 20) return { color: 'text-blue-600', status: 'Good' }
    if (credits >= 5) return { color: 'text-yellow-600', status: 'Low' }
    return { color: 'text-red-600', status: 'Critical' }
  }

  const { color, status } = getCreditsStatus()

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                  {loading ? 'Loading...' : `${credits ?? 0}`}
                </p>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Credits
                </Badge>
              </div>
              <p className={`text-xs font-medium ${color}`}>
                {status} • Available for AI generations
              </p>
            </div>
          </div>
          
          <Button size="sm" variant="outline" asChild className="shrink-0">
            <Link href="/pricing">
              <Plus className="h-4 w-4 mr-1" />
              Buy More
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}