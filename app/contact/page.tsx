import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help with your account, billing, or technical issues",
      contact: "support@polniy.com",
      response: "Within 24 hours"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available in dashboard",
      response: "Instant response"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our enterprise support team",
      contact: "+1 (555) 123-4567",
      response: "Business hours only"
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Browse our comprehensive knowledge base",
      contact: "help.polniy.com",
      response: "24/7 availability"
    }
  ]

  const offices = [
    {
      city: "San Francisco",
      address: "123 Innovation Drive\nSan Francisco, CA 94105\nUnited States",
      type: "Headquarters"
    },
    {
      city: "London",
      address: "45 Tech Square\nLondon EC2A 4DN\nUnited Kingdom",
      type: "European Office"
    },
    {
      city: "Singapore",
      address: "88 Marina Bay\nSingapore 018956\nSingapore",
      type: "Asia Pacific Office"
    }
  ]

  const supportTypes = [
    {
      icon: Users,
      title: "General Support",
      description: "Account questions, billing inquiries, and general help",
      email: "support@polniy.com"
    },
    {
      icon: Zap,
      title: "Technical Support",
      description: "API issues, integration help, and technical troubleshooting",
      email: "tech@polniy.com"
    },
    {
      icon: Users,
      title: "Enterprise Sales",
      description: "Custom solutions, enterprise pricing, and partnerships",
      email: "sales@polniy.com"
    },
    {
      icon: MessageSquare,
      title: "Media Inquiries",
      description: "Press releases, interviews, and media partnerships",
      email: "press@polniy.com"
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
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-semibold text-sm">{method.contact}</div>
                    <Badge variant="secondary" className="text-xs">{method.response}</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Support Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Get the Right Help</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {supportTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {type.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`mailto:${type.email}`}>{type.email}</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Office Locations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Offices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {offices.map((office, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{office.city}</CardTitle>
                  <Badge variant="secondary">{office.type}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="whitespace-pre-line text-sm">
                    {office.address}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Business Hours */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Support Hours</CardTitle>
            <CardDescription>
              Our team is available to help you during these hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold mb-2">Americas</h3>
                <p className="text-sm text-muted-foreground">Monday - Friday</p>
                <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM PST</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Europe</h3>
                <p className="text-sm text-muted-foreground">Monday - Friday</p>
                <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM GMT</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Asia Pacific</h3>
                <p className="text-sm text-muted-foreground">Monday - Friday</p>
                <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM SGT</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I get started with Polniy?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simply sign up for a free account and you'll receive 10 credits to try our platform. No credit card required!
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay via bank transfer.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Yes, we take security seriously. All data is encrypted in transit and at rest, and we comply with SOC 2 Type II and GDPR requirements.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Absolutely! You can cancel your subscription at any time from your account settings. No cancellation fees or long-term commitments.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our support team is standing by to help you get the most out of Polniy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="mailto:support@polniy.com">Email Support</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">Browse Documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}