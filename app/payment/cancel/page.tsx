'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-20">
      <div className="flex flex-col items-center justify-center space-y-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
            <CardDescription>
              Your payment was cancelled. No charges have been made to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground">
              <p>You can try again anytime or contact support if you need assistance.</p>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button 
                onClick={() => router.push('/pricing')} 
                className="w-full"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')} 
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={() => router.push('/contact')} 
                variant="ghost"
                className="w-full"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}