'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Coins, Plus, Sparkles, Crown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface UserProfile {
  credits: number
  isPro: boolean
  hasUnlimitedCredits: boolean
  isAdmin: boolean
}

export function CreditsDisplay() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile')
        setUserProfile(response.data)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const getCreditsStatus = () => {
    if (!userProfile) return { color: 'text-gray-500', status: 'Loading' }
    
    const credits = userProfile.credits
    
    if (userProfile.hasUnlimitedCredits || userProfile.isAdmin) {
      return { color: 'text-purple-600', status: 'Unlimited' }
    }
    
    if (credits >= 50) return { color: 'text-green-600', status: 'Excellent' }
    if (credits >= 20) return { color: 'text-blue-600', status: 'Good' }
    if (credits >= 5) return { color: 'text-yellow-600', status: 'Low' }
    return { color: 'text-red-600', status: 'Critical' }
  }

  const { color, status } = getCreditsStatus()
  const credits = userProfile?.credits ?? 0
  const isPro = userProfile?.isPro || userProfile?.hasUnlimitedCredits || userProfile?.isAdmin

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                  {loading ? 'Loading...' : (userProfile?.hasUnlimitedCredits || userProfile?.isAdmin) ? '∞' : `${credits}`}
                </p>
                <Badge variant="secondary" className="text-sm">
                  {(userProfile?.hasUnlimitedCredits || userProfile?.isAdmin) ? (
                    <Crown className="h-3 w-3 mr-1" />
                  ) : (
                    <Sparkles className="h-3 w-3 mr-1" />
                  )}
                  Credits
                </Badge>
              </div>
              <p className={`text-sm font-medium ${color}`}>
                {status} • Available for AI generations
              </p>
            </div>
          </div>
          
          {!isPro && (
            <Button size="sm" variant="outline" asChild className="shrink-0 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-950/50 dark:hover:to-blue-950/50 transition-all duration-300">
              <Link href="/pricing">
                <Plus className="h-4 w-4 mr-1" />
                Buy More
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}