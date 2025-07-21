'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Loader } from 'lucide-react'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'
import { useToast } from '@/components/ui/use-toast'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (sessionId) {
      // Verify payment with backend
      const verifyPayment = async () => {
        try {
          const result = await makeApiRequest(
            () => apiClient.post('/api/stripe/verify-payment', { sessionId }),
            {
              context: 'Verifying payment',
              customErrorMessage: 'Failed to verify payment. Please contact support.',
            }
          )
          
          if (result) {
            setPaymentDetails(result.data)
            toast({
              title: 'Payment Successful!',
              description: 'Your payment has been processed successfully.',
            })
          }
        } catch (error) {
          console.error('Payment verification failed:', error)
        } finally {
          setIsLoading(false)
        }
      }

      verifyPayment()
    } else {
      setIsLoading(false)
    }
  }, [searchParams, toast])

  if (isLoading) {
    return (
      <div className="container mx-auto py-20">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader className="h-8 w-8 animate-spin" />
          <p>Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-20">
      <div className="flex flex-col items-center justify-center space-y-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for your purchase. Your payment has been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentDetails && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">${paymentDetails.amount}</span>
                </div>
                {paymentDetails.credits && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="font-medium">{paymentDetails.credits}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">Completed</span>
                </div>
              </div>
            )}
            
            <div className="pt-4 space-y-2">
              <Button 
                onClick={() => router.push('/dashboard')} 
                className="w-full"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={() => router.push('/settings')} 
                variant="outline"
                className="w-full"
              >
                View Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-20">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader className="h-8 w-8 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}