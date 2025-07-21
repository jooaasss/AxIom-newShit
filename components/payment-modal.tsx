'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/loader'
import { Check, CreditCard, Zap } from 'lucide-react'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'
import { useToast } from '@/components/ui/use-toast'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan?: {
    type: 'free' | 'pro' | 'credits'
    priceId?: string
    cycle?: 'monthly' | 'annually'
    amount?: number
    price?: number
    credits?: number
    name?: string
    description?: string
  } | null
}

const plans = {
  free: {
    name: 'Free Plan',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic features',
    features: [
      '10 text generations per month',
      '5 code generations per month',
      '3 image generations per month',
      '1 website generation per month',
      'Community support',
      'Basic AI models',
    ],
    popular: false,
  },
  pro: {
    name: 'Pro Subscription',
    price: '$20',
    period: 'per month',
    description: 'Unlimited generations for power users',
    features: [
      'Unlimited text generation',
      'Unlimited code generation', 
      'Unlimited image generation',
      'Unlimited website generation',
      'Priority support',
      'Advanced AI models',
    ],
    popular: true,
  },
  credits: {
    name: 'Pay As You Go',
    price: 'From $10',
    period: 'one-time',
    description: 'Buy credits for occasional use',
    features: [
      'Text: 1 credit per generation',
      'Code: 2 credits per generation',
      'Image: 3 credits per generation',
      'Website: 5 credits per generation',
      'No monthly commitment',
      'Bulk discounts available',
    ],
    popular: false,
  },
}

const creditPackages = [
  { amount: 100, price: 10, popular: false },
  { amount: 500, price: 40, popular: true },
  { amount: 1000, price: 70, popular: false },
]

export function PaymentModal({ isOpen, onClose, selectedPlan }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCreditPackage, setSelectedCreditPackage] = useState<number | null>(null)
  const { toast } = useToast()

  const handleSubscription = async () => {
    setIsLoading(true)
    try {
      const requestData = {
        priceId: selectedPlan?.priceId,
        cycle: selectedPlan?.cycle
      }
      
      const result = await makeApiRequest(
        () => apiClient.post('/api/stripe', requestData),
        {
          context: 'Getting subscription URL',
          customErrorMessage: 'Failed to get subscription link. Please try again.',
        }
      )
      
      if (result) {
        window.location.href = result.data.url
      }
    } catch (error) {
      console.error('Subscription error:', error)
      toast({
        title: 'Error',
        description: 'Failed to start subscription process. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyCredits = async (amount: number) => {
    setIsLoading(true)
    try {
      const result = await makeApiRequest(
        () => apiClient.post('/api/stripe/credits', { amount }),
        {
          context: 'Purchasing credits',
          customErrorMessage: 'Failed to purchase credits. Please try again.',
        }
      )
      
      if (result) {
        window.location.href = result.data.url
      }
    } catch (error) {
      console.error('Credits purchase error:', error)
      toast({
        title: 'Error',
        description: 'Failed to start credit purchase. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderPlanDetails = () => {
    if (!selectedPlan || !plans[selectedPlan.type]) return null

    const plan = plans[selectedPlan.type]

    return (
      <Card className="mb-6 transition-all duration-200 hover:shadow-lg border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {plan.name}
                {plan.popular && (
                  <Badge variant="default" className="text-xs">
                    Popular
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {selectedPlan.price ? `$${selectedPlan.price}` : plan.price}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedPlan.cycle === 'annually' ? 'per year' : plan.period}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )
  }

  const renderCreditPackages = () => {
    if (selectedPlan?.type !== 'credits') return null

    return (
      <div className="space-y-3 mb-6">
        <h4 className="font-medium">Choose a credit package:</h4>
        {creditPackages.map((pkg) => (
          <Card 
            key={pkg.amount}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
              selectedCreditPackage === pkg.amount 
                ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20' 
                : 'hover:border-primary/50 hover:bg-primary/5'
            }`}
            onClick={() => setSelectedCreditPackage(pkg.amount)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{pkg.amount} Credits</div>
                    <div className="text-sm text-muted-foreground">
                      ${(pkg.price / pkg.amount * 100).toFixed(1)} per 100 credits
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${pkg.price}</div>
                  {pkg.popular && (
                    <Badge variant="default" className="text-xs">
                      Best Value
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const handlePayment = () => {
    if (selectedPlan?.type === 'pro') {
      handleSubscription()
    } else if (selectedPlan?.type === 'credits' && selectedCreditPackage) {
      handleBuyCredits(selectedCreditPackage)
    }
  }

  const isPaymentDisabled = () => {
    if (selectedPlan?.type === 'credits') {
      return !selectedCreditPackage || isLoading
    }
    return isLoading
  }

  const getButtonText = () => {
    if (isLoading) return 'Processing...'
    if (selectedPlan?.type === 'pro') {
      return `Subscribe ${selectedPlan.cycle === 'annually' ? 'Annually' : 'Monthly'}`
    }
    if (selectedPlan?.type === 'credits') {
      if (!selectedCreditPackage) return 'Select Package'
      return `Buy ${selectedCreditPackage} Credits`
    }
    return 'Continue'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            <CreditCard className="h-6 w-6 text-primary" />
            Complete Your Purchase
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            🚀 You're about to upgrade your account. Review your selection below.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderPlanDetails()}
          {renderCreditPackages()}

          <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-4 border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <span>🔒 Secure payment with Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2 font-medium">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span>✨ Cancel anytime (for subscriptions)</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handlePayment}
            disabled={isPaymentDisabled()}
            className="flex-1 transition-all duration-200 hover:scale-105"
            size="lg"
          >
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}