'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from '@/components/loader'
import { useToast } from '@/components/ui/use-toast'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'
import { Check } from 'lucide-react'
import { PaymentModal } from '@/components/payment-modal'

export default function PricingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'credits' | null>(null)

  const handlePlanSelection = (plan: 'pro' | 'credits') => {
    setSelectedPlan(plan)
    setIsPaymentModalOpen(true)
  }

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedPlan(null)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Pricing Plans</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose the plan that works best for you
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                <span>5 free generations</span>
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

        <Card className="flex flex-col border-primary">
          <CardHeader>
            <div className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground w-fit mb-2">
              Popular
            </div>
            <CardTitle>Pro</CardTitle>
            <CardDescription>
              Unlimited generations for power users
            </CardDescription>
            <div className="mt-4 text-4xl font-bold">$20</div>
            <p className="text-sm text-muted-foreground">per month</p>
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
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handlePlanSelection('pro')} 
              disabled={isLoading}
              className="w-full"
            >
              Subscribe
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
                <span>Image: 3 credits per generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Website: 5 credits per generation</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Bulk discounts available</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handlePlanSelection('credits')} 
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