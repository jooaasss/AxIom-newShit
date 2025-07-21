'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Crown, Sparkles, ArrowRight, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'

interface UserProfile {
  credits: number
  isPro: boolean
  hasUnlimitedCredits: boolean
  isAdmin: boolean
  stripeSubscriptionId: string | null
  stripeCurrentPeriodEnd: string | null
}

export function SubscriptionStatus() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  if (loading) {
    return (
      <Badge variant="outline" className="px-3 py-1 animate-pulse">
        <Sparkles className="h-4 w-4 mr-2" />
        Loading...
      </Badge>
    )
  }

  if (!userProfile) {
    return null
  }

  // Pro user display
  if (userProfile.isPro || userProfile.hasUnlimitedCredits || userProfile.isAdmin) {
    return (
      <div className="flex items-center space-x-4">
        <Badge 
          variant="outline" 
          className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300 dark:border-purple-700 hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300"
        >
          <Crown className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
          <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Pro User
          </span>
        </Badge>
        
        {userProfile.stripeCurrentPeriodEnd && (
          <div className="text-sm text-muted-foreground">
            Renews {new Date(userProfile.stripeCurrentPeriodEnd).toLocaleDateString()}
          </div>
        )}
      </div>
    )
  }

  // Free user display with upgrade button
  return (
    <div className="flex items-center space-x-4">
      <Badge variant="secondary" className="px-3 py-1">
        <Sparkles className="h-4 w-4 mr-2" />
        Free Plan
      </Badge>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="group relative overflow-hidden bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300 dark:border-purple-700 hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Crown className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Upgrade to Pro
            </span>
            <ArrowRight className="h-4 w-4 ml-2 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Upgrade to Pro
              </span>
            </DialogTitle>
            <DialogDescription className="text-base">
              Unlock unlimited AI generations and premium features with our Pro plan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium">Unlimited AI generations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium">Access to premium AI models</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium">Priority support</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Maybe Later
            </Button>
            <Button 
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Link href="/pricing" onClick={() => setIsDialogOpen(false)}>
                <Crown className="h-4 w-4 mr-2" />
                View Pricing
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}