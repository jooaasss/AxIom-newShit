import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Lock, Users, FileText, Globe, Zap } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2025"

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: FileText,
      content: [
        "Account information (name, email, password)",
        "Usage data and analytics",
        "Content you create using our platform",
        "Payment and billing information",
        "Device and browser information",
        "IP address and location data"
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        "Provide and improve our services",
        "Process payments and billing",
        "Send important updates and notifications",
        "Analyze usage patterns to enhance user experience",
        "Prevent fraud and ensure security",
        "Comply with legal obligations"
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: Users,
      content: [
        "We do not sell your personal information",
        "Service providers (payment processors, hosting)",
        "Legal compliance when required by law",
        "Business transfers (mergers, acquisitions)",
        "With your explicit consent",
        "Aggregated, anonymized data for research"
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        "End-to-end encryption for sensitive data",
        "Regular security audits and assessments",
        "SOC 2 Type II compliance",
        "Multi-factor authentication",
        "Secure data centers with 24/7 monitoring",
        "Employee background checks and training"
      ]
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: Shield,
      content: [
        "Access your personal data",
        "Correct inaccurate information",
        "Delete your account and data",
        "Export your data",
        "Opt-out of marketing communications",
        "Object to certain data processing"
      ]
    },
    {
      id: "international",
      title: "International Transfers",
      icon: Globe,
      content: [
        "Data may be processed in multiple countries",
        "Adequate protection measures in place",
        "GDPR compliance for EU users",
        "Standard contractual clauses",
        "Regular adequacy assessments",
        "User consent for cross-border transfers"
      ]
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
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <Badge variant="secondary" className="text-sm">
            Last updated: {lastUpdated}
          </Badge>
        </div>

        {/* Introduction */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Commitment to Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              At AxIom, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our 
              AI-powered creation platform. By using our services, you agree to the collection and use of information in 
              accordance with this policy.
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

        {/* Cookies Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to enhance your experience on our platform:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Essential Cookies</h4>
                <p className="text-sm text-muted-foreground">Required for basic functionality and security</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground">Help us understand how you use our platform</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Preference Cookies</h4>
                <p className="text-sm text-muted-foreground">Remember your settings and preferences</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We retain your personal information only as long as necessary to provide our services and comply with legal obligations:
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Account Information</span>
                <Badge variant="outline">Until account deletion</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Usage Analytics</span>
                <Badge variant="outline">24 months</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Payment Records</span>
                <Badge variant="outline">7 years (legal requirement)</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Generated Content</span>
                <Badge variant="outline">Until deletion by user</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and believe your child has provided 
              us with personal information, please contact us immediately so we can delete such information.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy 
              Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> privacy@AxIom.com</p>
              <p><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105</p>
              <p><strong>Data Protection Officer:</strong> dpo@AxIom.com</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Questions About Privacy?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our privacy team is here to help you understand how we protect your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="mailto:privacy@AxIom.com">Contact Privacy Team</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">General Contact</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}