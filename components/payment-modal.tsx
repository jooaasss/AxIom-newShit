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
  } | null
}

const plans = {
  pro: {
    name: 'Pro подписка',
    description: 'Безлимитные генерации для продвинутых пользователей',
    features: [
      'Безлимитные генерации*',
      'Продвинутая генерация текста и кода',
      'Генерация изображений и AI Поиск',
      'Приоритетная поддержка',
      'Продвинутые AI модели',
    ],
    popular: true,
  },
  credits: {
    name: 'Кредитные пакеты',
    description: 'Покупайте кредиты для периодического использования',
    features: [
      'Текст: 1 кредит за генерацию',
      'Код: 2 кредита за генерацию',
      'Изображение: 3 кредита за генерацию',
      'AI Поиск: 1 кредит за запрос',
      'Без ежемесячных обязательств',
      'Скидки при покупке больших пакетов',
    ],
    popular: false,
  },
}

const creditPackages = [
  { amount: 1000, price: 5, popular: true },
  { amount: 5000, price: 20, popular: false },
  { amount: 10000, price: 35, popular: false },
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
    if (!selectedPlan) return null

    let plan, price, period
    
    if (selectedPlan.type === 'pro') {
      plan = plans.pro
      price = selectedPlan.cycle === 'annually' ? '$288' : '$24'
      period = selectedPlan.cycle === 'annually' ? 'в год' : 'в месяц'
    } else if (selectedPlan.type === 'credits') {
      plan = plans.credits
      const pkg = creditPackages.find(p => p.amount === selectedPlan.amount)
      price = pkg ? `$${pkg.price}` : 'N/A'
      period = 'единоразово'
    } else {
      return null
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {selectedPlan.type === 'credits' && selectedPlan.amount ? 
                  `${selectedPlan.amount} кредитов` : plan.name}
                {plan.popular && (
                  <Badge variant="default" className="text-xs">
                    Популярный
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{price}</div>
              <div className="text-sm text-muted-foreground">{period}</div>
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
        <h4 className="font-medium">Выберите кредитный пакет:</h4>
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
                    <div className="font-medium">{pkg.amount} кредитов</div>
                    <div className="text-sm text-muted-foreground">
                      ${(pkg.price / pkg.amount * 1000).toFixed(1)} за 1000 кредитов
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${pkg.price}</div>
                  {pkg.popular && (
                    <Badge variant="default" className="text-xs">
                      Выгодно
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
    if (isLoading) return 'Обработка...'
    if (selectedPlan?.type === 'pro') return 'Подписаться'
    if (selectedPlan?.type === 'credits') {
      if (!selectedCreditPackage) return 'Выберите пакет'
      return `Купить ${selectedCreditPackage} кредитов`
    }
    return 'Продолжить'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Завершите покупку
          </DialogTitle>
          <DialogDescription>
            Вы собираетесь обновить свой аккаунт. Проверьте ваш выбор ниже.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderPlanDetails()}
          {renderCreditPackages()}

          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>Безопасная оплата через Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <Check className="h-4 w-4 text-green-500" />
              <span>Отмена в любое время (для подписок)</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Отмена
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