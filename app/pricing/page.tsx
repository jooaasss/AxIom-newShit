'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Check, Crown } from 'lucide-react'
import { PaymentModal } from '@/components/payment-modal'
import { Loader } from '@/components/loader'

interface UserProfile {
  id: string
  email: string
  credits: number
  isPro: boolean
  hasUnlimitedCredits: boolean
  isAdmin: boolean
}

// --- ДАННЫЕ ДЛЯ ТАРИФОВ ---
const pricingData = {
  pro: {
    monthly: {
      price: 20,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_1QdqGJP123456789',
    },
    annually: {
      price: 144,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID || 'price_1QdqGKP123456789',
    },
  },
  credits: [
    {
      name: 'Стартовый',
      credits: 100,
      price: 10,
      priceId: process.env.NEXT_PUBLIC_STRIPE_CREDITS_PRICE_ID || 'price_1QdqGLP123456789',
      description: 'Для начинающих',
    },
  ],
}

export default function PricingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    type: 'free' | 'pro' | 'credits'
    priceId?: string
    cycle?: 'monthly' | 'annually'
    amount?: number
    price?: number
    credits?: number
    name?: string
    description?: string
  } | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly')

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const profile = await response.json()
        setUserProfile(profile)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const handlePlanSelection = (planDetails: {
    type: 'free' | 'pro' | 'credits'
    priceId?: string
    cycle?: 'monthly' | 'annually'
    amount?: number
    price?: number
    credits?: number
    name?: string
    description?: string
  }) => {
    setSelectedPlan(planDetails)
    setIsPaymentModalOpen(true)
  }

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedPlan(null)
  }

  const isProUser = userProfile?.isPro || userProfile?.hasUnlimitedCredits || userProfile?.isAdmin
  const proPrice = billingCycle === 'monthly' ? pricingData.pro.monthly.price : pricingData.pro.annually.price
  const proPriceId = billingCycle === 'monthly' ? pricingData.pro.monthly.priceId : pricingData.pro.annually.priceId
  const perMonthPrice = billingCycle === 'monthly' ? proPrice : proPrice / 12

  if (profileLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Pricing Plans</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose the plan that works best for you
        </p>
        
        {/* Переключатель месяц/год */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <Label htmlFor="billing-toggle" className={billingCycle === 'monthly' ? 'font-semibold' : ''}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === 'annually'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
          />
          <Label htmlFor="billing-toggle" className={billingCycle === 'annually' ? 'font-semibold' : ''}>
            Annually
            <Badge variant="secondary" className="ml-2">Save 40%</Badge>
          </Label>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>
              Get started with basic features
            </CardDescription>
            <div className="mt-4 text-4xl font-bold">$0</div>
            <p className="text-sm text-muted-foreground">Forever free</p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>10 free generations</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Basic text generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Basic code generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Generation history</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => router.push('/dashboard')} 
              className="w-full"
              variant="outline"
            >
              Get Started
            </Button>
          </CardFooter>
        </Card>

        <Card className={`flex flex-col relative ${isProUser ? 'border-green-500' : 'border-primary'}`}>
          <CardHeader>
            {isProUser ? (
              <Badge className="bg-green-500 text-white px-3 py-1 text-xs w-fit mb-2">
                <Crown className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <div className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground w-fit mb-2">
                Most Popular
              </div>
            )}
            <CardTitle className="flex items-center">
              Pro
              {isProUser && <Crown className="h-5 w-5 ml-2 text-yellow-500" />}
            </CardTitle>
            <CardDescription>
              Unlimited generations for power users
            </CardDescription>
            <div className="mt-4">
              <div className="text-4xl font-bold">${proPrice}</div>
              {billingCycle === 'annually' && (
                <div className="text-sm text-muted-foreground line-through">$240</div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {billingCycle === 'monthly' ? 'per month' : `per year ($${Math.round(perMonthPrice)}/month)`}
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Unlimited generations</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Advanced text generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Advanced code generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Image generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Website generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Priority support</span>
              </li>
              {billingCycle === 'annually' && (
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Early access to features</span>
                </li>
              )}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handlePlanSelection({
                type: 'pro',
                priceId: proPriceId,
                cycle: billingCycle,
                price: proPrice
              })} 
              disabled={isLoading || isProUser}
              className="w-full"
              variant={isProUser ? 'secondary' : 'default'}
            >
              {isProUser ? (
                <span className="flex items-center">
                  <Crown className="h-4 w-4 mr-2" />
                  Subscription Active
                </span>
              ) : (
                `Subscribe ${billingCycle === 'annually' ? 'Annually' : 'Monthly'}`
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Pay As You Go</CardTitle>
            <CardDescription>
              Buy credits for occasional use
            </CardDescription>
            <div className="mt-4 text-4xl font-bold">$10</div>
            <p className="text-sm text-muted-foreground">for 100 credits</p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Text: 1 credit per generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Code: 2 credits per generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>AI Search: 3 credits per generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Image: 5 credits per generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Bulk discounts available</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handlePlanSelection({
                type: 'credits',
                priceId: pricingData.credits[0].priceId,
                credits: pricingData.credits[0].credits,
                price: pricingData.credits[0].price,
                name: pricingData.credits[0].name,
                description: pricingData.credits[0].description
              })} 
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              Buy Credits
            </Button>
          </CardFooter>
        </Card>
      </div>

      <PaymentModal 
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          selectedPlan={selectedPlan}
        />
    </div>
  )
}