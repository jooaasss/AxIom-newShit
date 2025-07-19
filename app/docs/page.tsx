import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Code, FileText, Image, Globe, Zap, Shield, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function DocumentationPage() {
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
              AxIom
            </span>
          </Link>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete guide to using AxIom's AI-powered creation platform. Learn how to generate text, code, images, and websites with our advanced tools.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-purple-600" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Get up and running with AxIom in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">1. Sign Up</div>
                <p className="text-sm text-muted-foreground">Create your free account and get started with 10 credits</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">2. Choose Tool</div>
                <p className="text-sm text-muted-foreground">Select from text, code, image, or website generation tools</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">3. Create</div>
                <p className="text-sm text-muted-foreground">Enter your prompt and let AI transform your ideas into reality</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Text Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate high-quality content, articles, emails, and creative writing with advanced AI models.
              </CardDescription>
              <div className="mt-4">
                <Badge variant="secondary">GPT-4</Badge>
                <Badge variant="secondary" className="ml-2">Claude</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Code Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create functions, debug code, and build applications across multiple programming languages.
              </CardDescription>
              <div className="mt-4">
                <Badge variant="secondary">JavaScript</Badge>
                <Badge variant="secondary" className="ml-2">Python</Badge>
                <Badge variant="secondary" className="ml-2">React</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <Image className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Image Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create stunning visuals, artwork, and designs from simple text descriptions.
              </CardDescription>
              <div className="mt-4">
                <Badge variant="secondary">DALL-E</Badge>
                <Badge variant="secondary" className="ml-2">Midjourney</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Website Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build complete websites and landing pages with modern design and responsive layouts.
              </CardDescription>
              <div className="mt-4">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary" className="ml-2">Tailwind</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Guides */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold mb-6">Detailed Guides</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Text Generation Guide</CardTitle>
              <CardDescription>Master the art of AI-powered content creation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Best Practices:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Be specific and detailed in your prompts</li>
                  <li>Specify the tone, style, and target audience</li>
                  <li>Include examples or references when possible</li>
                  <li>Use clear formatting instructions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Example Prompts:</h4>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p>"Write a professional email to a client explaining a project delay, maintaining a positive tone and offering solutions."</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code Generation Guide</CardTitle>
              <CardDescription>Generate clean, efficient code for any project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Supported Languages:</h4>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'Python', 'TypeScript', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'Java', 'C++', 'Go'].map((lang) => (
                    <Badge key={lang} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tips for Better Results:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Specify the programming language and framework</li>
                  <li>Describe the function's purpose and expected inputs/outputs</li>
                  <li>Mention any specific requirements or constraints</li>
                  <li>Request comments and documentation</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image Generation Guide</CardTitle>
              <CardDescription>Create stunning visuals with AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Prompt Structure:</h4>
                <div className="bg-muted p-3 rounded-lg text-sm space-y-2">
                  <p><strong>Subject:</strong> What you want to create</p>
                  <p><strong>Style:</strong> Art style, photography type, or aesthetic</p>
                  <p><strong>Details:</strong> Colors, lighting, composition</p>
                  <p><strong>Quality:</strong> Resolution and quality modifiers</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Example:</h4>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p>"A serene mountain landscape at sunset, digital art style, warm golden lighting, high resolution, detailed"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-12" />

        {/* Pricing & Credits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              Credits & Pricing
            </CardTitle>
            <CardDescription>
              Understanding how credits work and pricing plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">Free Plan</div>
                <div className="text-2xl font-bold text-green-600 mb-2">10 Credits</div>
                <p className="text-sm text-muted-foreground">Perfect for trying out the platform</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">Pro Plan</div>
                <div className="text-2xl font-bold text-blue-600 mb-2">$20/month</div>
                <p className="text-sm text-muted-foreground">Unlimited generations for professionals</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">Enterprise</div>
                <div className="text-2xl font-bold text-purple-600 mb-2">Custom</div>
                <p className="text-sm text-muted-foreground">Tailored solutions for teams</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/pricing">View All Plans</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              Support & Community
            </CardTitle>
            <CardDescription>
              Get help and connect with other creators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">Contact Support</div>
                <p className="text-sm text-muted-foreground mb-3">Get help with technical issues or billing questions</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">Security & Privacy</div>
                <p className="text-sm text-muted-foreground mb-3">Learn about our security measures and privacy policy</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">SOC 2</Badge>
                  <Badge variant="secondary">GDPR</Badge>
                  <Badge variant="secondary">Encrypted</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}