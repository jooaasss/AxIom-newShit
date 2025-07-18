'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from '@/components/loader'
import { toast } from 'sonner'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'
import { CreditsDisplay } from '@/components/dashboard/credits'

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscription = async () => {
    setIsLoading(true)
    const result = await makeApiRequest(
      () => apiClient.get('/api/stripe'),
      {
        context: 'Getting subscription URL',
        customErrorMessage: 'Не удалось получить ссылку на подписку. Попробуйте еще раз.',
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
        customErrorMessage: 'Не удалось приобрести кредиты. Попробуйте еще раз.',
      }
    )
    
    if (result) {
      window.location.href = result.data.url
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <CreditsDisplay />
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Upgrade to Pro for unlimited AI generations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pro subscription includes:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
              <li>Unlimited AI generations</li>
              <li>Priority processing</li>
              <li>Advanced customization options</li>
              <li>Early access to new features</li>
            </ul>
            <p className="mt-4 font-medium">
              $20/month
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubscription} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader className="mr-2" /> : null}
              Upgrade to Pro
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buy Credits</CardTitle>
            <CardDescription>
              Purchase credits for pay-as-you-go usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Credits are used for AI generations:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
              <li>Text generation: 1 credit</li>
              <li>Code generation: 2 credits</li>
              <li>Image generation: 3 credits</li>
              <li>Website generation: 5 credits</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={() => handleBuyCredits(100)} 
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              100 Credits - $10
            </Button>
            <Button 
              onClick={() => handleBuyCredits(500)} 
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              500 Credits - $40 (20% off)
            </Button>
            <Button 
              onClick={() => handleBuyCredits(1000)} 
              disabled={isLoading}
              className="w-full"
            >
              1000 Credits - $70 (30% off)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}