import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Code, Image, Globe, Zap, Shield, Clock, Users, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  const features = [
    {
      icon: FileText,
      title: "Advanced Text Generation",
      description: "Create high-quality content with state-of-the-art AI models including GPT-4 and Claude.",
      benefits: ["Blog posts & articles", "Marketing copy", "Technical documentation", "Creative writing"]
    },
    {
      icon: Code,
      title: "Smart Code Generation",
      description: "Generate, debug, and optimize code across multiple programming languages and frameworks.",
      benefits: ["Full-stack applications", "API endpoints", "Database queries", "Code optimization"]
    },
    {
      icon: Image,
      title: "AI Image Creation",
      description: "Transform text descriptions into stunning visuals, artwork, and professional designs.",
      benefits: ["Marketing materials", "Social media graphics", "Product mockups", "Artistic creations"]
    },
    {
      icon: Globe,
      title: "Website Builder",
      description: "Build complete, responsive websites with modern design and optimized performance.",
      benefits: ["Landing pages", "E-commerce sites", "Portfolio websites", "Business pages"]
    }
  ]

  const advantages = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate content in seconds, not hours. Our optimized AI models deliver results instantly."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Your data is protected with enterprise-grade security and privacy measures."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access our AI tools anytime, anywhere. No downtime, no waiting."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share projects and collaborate with your team seamlessly."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation Header */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Polniy
              </span>
            </Link>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Powerful Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the comprehensive suite of AI-powered tools designed to transform your creative workflow and boost productivity.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Advantages */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Polniy?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {advantage.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold">$0</div>
                <CardDescription>Perfect for trying out our platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">10 credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Basic text generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Standard support</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">$29</div>
                <CardDescription>For professionals and teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Unlimited generations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">All AI models</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Team collaboration</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold">Custom</div>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Custom integrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Dedicated support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">SLA guarantees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Advanced security</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using Polniy to transform their ideas into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}