'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Zap, Sparkles, Code, Image, Search, Star, Check, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn, isLoaded } = useUser()

  const features = [
    {
      icon: Sparkles,
      title: 'Text Generation',
      description: 'Create compelling content, articles, and copy with advanced AI models.',
      color: 'text-purple-500',
    },
    {
      icon: Code,
      title: 'Code Generation',
      description: 'Generate clean, efficient code in multiple programming languages.',
      color: 'text-blue-500',
    },
    {
      icon: Image,
      title: 'Image Creation',
      description: 'Transform your ideas into stunning visuals with AI-powered image generation.',
      color: 'text-green-500',
    },
    {
      icon: Search,
      title: 'AI Search',
      description: 'Intelligent search capabilities powered by advanced AI algorithms.',
      color: 'text-orange-500',
    },
  ]

  const stats = [
    { label: 'Active Users', value: '1K+' },
    { label: 'Tokens Used', value: '10K+' },
    { label: 'Success Rate', value: '99.9%' },
    { label: 'Programming Languages', value: '25+' },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Content Creator',
      content: 'AxIom has revolutionized my content creation process. I can generate high-quality articles in minutes!',
      rating: 5,
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Software Developer',
      content: 'The code generation feature is incredible. It helps me prototype faster and learn new frameworks.',
      rating: 5,
    },
    {
      name: 'Emily Watson',
      role: 'Digital Marketer',
      content: 'Creating visuals for campaigns has never been easier. The AI understands exactly what I need.',
      rating: 5,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AxIom
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            {isLoaded && (
              isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <Button asChild variant="outline">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
                    Sign In
                  </Link>
                  <Button asChild>
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </>
              )
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="flex flex-col space-y-4 p-4">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                Testimonials
              </Link>
              {isLoaded && (
                isSignedIn ? (
                  <div className="flex flex-col space-y-4">
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <div className="flex justify-center">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                ) : (
                  <>
                    <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
                      Sign In
                    </Link>
                    <Button asChild className="w-full">
                      <Link href="/sign-up">Get Started</Link>
                    </Button>
                  </>
                )
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20" />
          <div className="container relative px-4">
            <div className="mx-auto max-w-4xl text-center">

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Create with the Power of{' '}
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Generate stunning text, code, images, and complete websites with our advanced AI platform. 
                Transform your ideas into reality in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8 py-6">
                  <Link href="/sign-up">
                    Start Creating Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                  <Link href="#features">
                    Explore Features
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Everything You Need to Create
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful AI tools designed for creators, developers, and businesses of all sizes.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-current to-current/80 ${feature.color} mx-auto mb-4 flex items-center justify-center bg-opacity-10`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-32">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Loved by Creators Worldwide
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See what our users are saying about their experience with AxIom.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base italic">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Ideas?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of creators who are already using AxIom to bring their visions to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
                <Link href="/sign-up">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-600">
                <Link href="#pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold">AxIom</span>
              </div>
              <p className="text-gray-400">
                AI-powered creation platform for the modern creator.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <Link href="/pricing" className="block text-gray-400 hover:text-white">
                  Pricing
                </Link>
                <Link href="/features" className="block text-gray-400 hover:text-white">
                  Features
                </Link>
                <Link href="/docs" className="block text-gray-400 hover:text-white">
                  Documentation
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-white">
                  About
                </Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white">
                  Contact
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="block text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AxIom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}