import { SignIn } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AxIom
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome back
          </h1>
        </div>

        {/* Sign In Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-white backdrop-blur-sm">
          <CardContent className="p-6">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 
                    'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-lg',
                  card: 'shadow-none border-0 bg-transparent',
                  headerTitle: 'text-2xl font-semibold text-gray-900 dark:text-black mb-1 text-center',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 
                    'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg',
                  formFieldInput: 
                    'border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-white dark:text-black',
                  footerActionLink: 
                    'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300',
                  socialButtonsBlockButtonText: 'dark:text-black',
                  formFieldLabel: 'dark:text-black',
                  identityPreviewText: 'dark:text-black',
                  formResendCodeLink: 'dark:text-purple-600',
                  alternativeMethodsBlockButton: 'dark:text-black dark:border-gray-300'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link 
              href="/sign-up" 
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
