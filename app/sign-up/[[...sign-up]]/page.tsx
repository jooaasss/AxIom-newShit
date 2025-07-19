import { SignUp } from '@clerk/nextjs'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Sparkles, Code, Image, Search } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const features = [
    { icon: Sparkles, text: 'AI Text Generation' },
    { icon: Code, text: 'Code Generation' },
    { icon: Image, text: 'Image Creation' },
    { icon: Search, text: 'AI Search' }
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AxIom
            </span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Create with the Power of AI
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of creators using AI to transform their ideas into reality.
          </p>
          
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {feature.text}
                  </span>
                </div>
              )
            })}
          </div>
          
          <div className="mt-8 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ✨ <strong>Free to start:</strong> Get 10 credits to explore all features
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AxIom
              </span>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Get started for free
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create your account and start generating with AI
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Start your AI-powered creative journey today
            </p>
          </div>

          {/* Sign Up Card */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-white backdrop-blur-sm">
            <CardContent className="p-6">
              <SignUp 
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
              Already have an account?{' '}
              <Link 
                href="/sign-in" 
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}