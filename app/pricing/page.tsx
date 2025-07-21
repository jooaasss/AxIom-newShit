'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { PaymentModal } from '@/components/payment-modal'

export const dynamic = 'force-dynamic'

// --- ДАННЫЕ ДЛЯ ТАРИФОВ ---
// Выносим данные в отдельный объект для чистоты кода
const pricingData = {
  pro: {
    monthly: {
      price: 24,
      priceId: 'price_monthly_pro_id', // Замените на ваш реальный Price ID из Stripe
    },
    annually: {
      price: 288, // $24/мес * 12
      priceId: 'price_annual_pro_id', // Замените на ваш реальный Price ID из Stripe
    },
  },
  credits: [
    {
      name: 'Стартовый',
      credits: 10000,
      price: 7,
      priceId: 'price_credits_10k_id', // Замените на ваш реальный Price ID
      description: 'Идеально для начала',
    },
    {
      name: 'Базовый',
      credits: 50000,
      price: 30, // Скидка $5
      priceId: 'price_credits_50k_id',
      description: 'Лучшее соотношение цены и качества',
      popular: true,
    },
    {
      name: 'Премиум',
      credits: 100000,
      price: 55, // Скидка $15
      priceId: 'price_credits_100k_id',
      description: 'Для опытных пользователей',
    },
  ],
}

export default function PricingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  
  // Состояние для выбранного плана, теперь это объект для большей гибкости
  const [selectedPlan, setSelectedPlan] = useState<{
    type: 'free' | 'pro' | 'credits'
    priceId?: string
    cycle?: 'monthly' | 'annually'
    amount?: number
    price?: number
    credits?: number
    name?: string
    description?: string
    popular?: boolean
  } | null>(null)
  
  // Состояние для переключения между месячной и годовой оплатой
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly')

  const handlePlanSelection = (planDetails: {
    type: 'free' | 'pro' | 'credits'
    priceId?: string
    cycle?: 'monthly' | 'annually'
    amount?: number
    price?: number
    credits?: number
    name?: string
    description?: string
    popular?: boolean
  }) => {
    setSelectedPlan(planDetails)
    setIsPaymentModalOpen(true)
  }

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedPlan(null)
  }

  const proPrice = billingCycle === 'monthly' ? pricingData.pro.monthly.price : pricingData.pro.annually.price
  const proPriceId = billingCycle === 'monthly' ? pricingData.pro.monthly.priceId : pricingData.pro.annually.priceId
  const perMonthPrice = billingCycle === 'monthly' ? proPrice : proPrice / 12

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Тарифные планы</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Выберите план, который подходит именно вам.
        </p>
      </div>

      {/* Переключатель Месяц/Год */}
      <div className="mb-8 flex items-center justify-center space-x-4">
        <Label htmlFor="billing-switch">Ежемесячно</Label>
        <Switch
          id="billing-switch"
          checked={billingCycle === 'annually'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
        />
        <Label htmlFor="billing-switch">
          Ежегодно <span className="text-sm text-green-500">(Экономия 20%)</span>
        </Label>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* --- БЕСПЛАТНЫЙ ТАРИФ --- */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>
              Начните с базовых функций
            </CardDescription>
            <div className="mt-4 text-4xl font-bold">$0</div>
            <p className="text-sm text-muted-foreground">Бесплатно навсегда</p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>10 бесплатных генераций</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Базовая генерация текста и кода</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>История генераций</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard')} className="w-full" variant="outline">
              Начать
            </Button>
          </CardFooter>
        </Card>

        {/* --- ТАРИФ PRO --- */}
        <Card className="flex flex-col border-2 border-primary">
          <CardHeader>
            <div className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground w-fit mb-2">
              Популярный
            </div>
            <CardTitle>Pro</CardTitle>
            <CardDescription>
              Безлимитные генерации для активных пользователей
            </CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">${Math.round(perMonthPrice)}</span>
              <span className="text-muted-foreground">/месяц</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {billingCycle === 'annually' ? `Оплата $${proPrice} в год` : 'Ежемесячная оплата'}
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
               <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Безлимитные генерации*</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Продвинутая генерация текста и кода</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Генерация изображений и AI Поиск</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Приоритетная поддержка</span>
              </li>
              <li className="mt-4 text-xs text-muted-foreground">
                *Применяется политика справедливого использования (Fair Use Policy).
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handlePlanSelection({ type: 'pro', priceId: proPriceId, cycle: billingCycle })}
              disabled={isLoading}
              className="w-full"
            >
              Подписаться
            </Button>
          </CardFooter>
        </Card>

        {/* --- PAY AS YOU GO --- */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Pay As You Go</CardTitle>
            <CardDescription>
              Покупайте кредиты по мере необходимости
            </CardDescription>
            <div className="mt-4 text-4xl font-bold">$5</div>
            <p className="text-sm text-muted-foreground">за 1000 кредитов</p>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="font-semibold mb-2">Стоимость генераций:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Текст: 1 кредит</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Код: 2 кредита</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>AI Поиск: 1 кредит</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Изображение: 3 кредита</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handlePlanSelection({ type: 'credits', amount: 1000, price: 5 })}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              Купить кредиты
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