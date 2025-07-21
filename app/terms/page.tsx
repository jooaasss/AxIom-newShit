import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Shield, AlertTriangle, CreditCard, Users, Gavel, Zap } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  const lastUpdated = "January 15, 2025"

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        "By accessing or using AxIom, you agree to be bound by these Terms",
        "You must be at least 18 years old to use our services",
        "If you disagree with any part of these terms, you may not use our services",
        "These terms apply to all users, including visitors and registered users"
      ]
    },
    {
      id: "services",
      title: "Description of Services",
      icon: Shield,
      content: [
        "AI-powered text, code, image generation, and AI search",
        "Cloud-based platform accessible via web browser",
        "User account management and billing services",
        "Customer support and documentation",
        "API access for developers (where applicable)"
      ]
    },
    {
      id: "user-accounts",
      title: "User Accounts",
      icon: Users,
      content: [
        "You are responsible for maintaining account security",
        "Provide accurate and complete registration information",
        "Notify us immediately of any unauthorized access",
        "One account per person or organization",
        "You may not share your account credentials"
      ]
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      icon: AlertTriangle,
      content: [
        "Use services only for lawful purposes",
        "Do not generate harmful, illegal, or offensive content",
        "Respect intellectual property rights",
        "Do not attempt to reverse engineer our services",
        "No spam, harassment, or abusive behavior",
        "Comply with all applicable laws and regulations"
      ]
    },
    {
      id: "payment",
      title: "Payment and Billing",
      icon: CreditCard,
      content: [
        "Subscription fees are billed in advance",
        "All fees are non-refundable unless required by law",
        "Automatic renewal unless cancelled",
        "Price changes with 30 days notice",
        "Taxes may apply based on your location",
        "Payment disputes must be raised within 60 days"
      ]
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: Gavel,
      content: [
        "Services provided 'as is' without warranties",
        "We are not liable for indirect or consequential damages",
        "Maximum liability limited to fees paid in last 12 months",
        "You assume responsibility for generated content",
        "Force majeure events beyond our control"
      ]
    }
  ]

  const prohibitedUses = [
    "Generating illegal, harmful, or offensive content",
    "Creating deepfakes or misleading media",
    "Violating intellectual property rights",
    "Spamming or unsolicited communications",
    "Attempting to hack or compromise our systems",
    "Reselling or redistributing our services",
    "Creating content that promotes violence or hatred",
    "Generating content for fraudulent purposes"
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
              AxIom
            </span>
          </Link>
        </div>
      </nav>

    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            These terms govern your use of AxIom's AI-powered creation platform and services.
          </p>
          <Badge variant="secondary" className="text-sm">
            Last updated: {lastUpdated}
          </Badge>
        </div>

        {/* Introduction */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Agreement Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to AxIom! These Terms of Service ("Terms") constitute a legally binding agreement between you and 
              AxIom Inc. ("Company," "we," "us," or "our") regarding your use of our AI-powered creation platform and 
              related services. Please read these Terms carefully before using our services. By creating an account or 
              using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index} id={section.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Prohibited Uses */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Prohibited Uses</CardTitle>
                <CardDescription>The following activities are strictly forbidden</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {prohibitedUses.map((use, index) => (
                <div key={index} className="flex items-start gap-2 p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-700 dark:text-red-300">{use}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Our Rights</h4>
              <p className="text-muted-foreground text-sm mb-3">
                AxIom owns all rights to our platform, technology, and proprietary algorithms. This includes our AI models, 
                user interface, and underlying software.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Your Content</h4>
              <p className="text-muted-foreground text-sm mb-3">
                You retain ownership of content you create using our platform. However, you grant us a license to process 
                and store your content to provide our services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Generated Content</h4>
              <p className="text-muted-foreground text-sm">
                You own the content generated by our AI based on your prompts, subject to these Terms and applicable law. 
                You are responsible for ensuring your use of generated content complies with all laws.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Availability */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">Service Availability and Modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Uptime Commitment</h4>
                <p className="text-sm text-muted-foreground">We strive for 99.9% uptime but cannot guarantee uninterrupted service</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Maintenance Windows</h4>
                <p className="text-sm text-muted-foreground">Scheduled maintenance will be announced in advance when possible</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Service Modifications</h4>
                <p className="text-sm text-muted-foreground">We may modify or discontinue features with reasonable notice</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <h4 className="font-semibold">By You</h4>
                  <p className="text-sm text-muted-foreground">You may terminate your account at any time through your account settings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <h4 className="font-semibold">By Us</h4>
                  <p className="text-sm text-muted-foreground">We may terminate accounts for violations of these Terms or illegal activity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <h4 className="font-semibold">Effect of Termination</h4>
                  <p className="text-sm text-muted-foreground">Upon termination, your access will cease and data may be deleted after 30 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">Governing Law and Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              These Terms are governed by the laws of the State of California, United States, without regard to conflict 
              of law principles. Any disputes arising from these Terms or your use of our services will be resolved through 
              binding arbitration in San Francisco, California, except for claims that may be brought in small claims court.
            </p>
            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold mb-2">Dispute Resolution Process</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Contact our support team to attempt resolution</li>
                <li>If unresolved, proceed to mediation</li>
                <li>Final resolution through binding arbitration</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> legal@AxIom.com</p>
              <p><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105</p>
              <p><strong>Legal Department:</strong> terms@AxIom.com</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Questions About These Terms?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our legal team is available to help clarify any questions about our Terms of Service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="mailto:legal@AxIom.com">Contact Legal Team</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">General Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}