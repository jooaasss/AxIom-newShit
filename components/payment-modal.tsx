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
  selectedPlan?: 'pro' | 'credits' | null
}

const plans = {
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
    const result = await makeApiRequest(
      () => apiClient.get('/api/stripe'),
      {
        context: 'Getting subscription URL',
        customErrorMessage: 'Failed to get subscription link. Please try again.',
      }
    )
    
    if (result) {
      window.location.href = result.data.url
    }
    setIsLoading(false)
  }

  const handleBuyCredits = async (amount: number) => {
    setIsLoading(true)
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
    setIsLoading(false)
  }

  const renderPlanDetails = () => {
    if (!selectedPlan || !plans[selectedPlan]) return null

    const plan = plans[selectedPlan]

    return (
      <Card className="mb-6">
        <CardHeader>
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
              <div className="text-2xl font-bold">{plan.price}</div>
              <div className="text-sm text-muted-foreground">{plan.period}</div>
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
    if (selectedPlan !== 'credits') return null

    return (
      <div className="space-y-3 mb-6">
        <h4 className="font-medium">Choose a credit package:</h4>
        {creditPackages.map((pkg) => (
          <Card 
            key={pkg.amount}
            className={`cursor-pointer transition-colors ${
              selectedCreditPackage === pkg.amount 
                ? 'border-primary bg-primary/5' 
                : 'hover:border-primary/50'
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
    if (selectedPlan === 'pro') {
      handleSubscription()
    } else if (selectedPlan === 'credits' && selectedCreditPackage) {
      handleBuyCredits(selectedCreditPackage)
    }
  }

  const isPaymentDisabled = () => {
    if (selectedPlan === 'credits') {
      return !selectedCreditPackage || isLoading
    }
    return isLoading
  }

  const getButtonText = () => {
    if (isLoading) return 'Processing...'
    if (selectedPlan === 'pro') return 'Subscribe Now'
    if (selectedPlan === 'credits') {
      if (!selectedCreditPackage) return 'Select Package'
      return `Buy ${selectedCreditPackage} Credits`
    }
    return 'Continue'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Purchase
          </DialogTitle>
          <DialogDescription>
            You're about to upgrade your account. Review your selection below.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderPlanDetails()}
          {renderCreditPackages()}

          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>Secure payment with Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancel anytime (for subscriptions)</span>
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
            className="flex-1"
          >
            {isLoading && <Loader className="mr-2 h-4 w-4" />}
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}