import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Cookie, Shield, BarChart3, Target, Settings, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function CookiePolicyPage() {
  const lastUpdated = "January 15, 2025"

  const cookieTypes = [
    {
      id: "essential",
      title: "Essential Cookies",
      icon: Shield,
      description: "Required for basic website functionality",
      required: true,
      examples: [
        "Authentication tokens",
        "Session management",
        "Security preferences",
        "Load balancing"
      ],
      retention: "Session or up to 1 year"
    },
    {
      id: "analytics",
      title: "Analytics Cookies",
      icon: BarChart3,
      description: "Help us understand how visitors use our website",
      required: false,
      examples: [
        "Page views and traffic sources",
        "User behavior patterns",
        "Performance metrics",
        "Error tracking"
      ],
      retention: "Up to 2 years"
    },
    {
      id: "marketing",
      title: "Marketing Cookies",
      icon: Target,
      description: "Used to deliver relevant advertisements",
      required: false,
      examples: [
        "Ad personalization",
        "Campaign effectiveness",
        "Cross-site tracking",
        "Retargeting"
      ],
      retention: "Up to 1 year"
    },
    {
      id: "preferences",
      title: "Preference Cookies",
      icon: Settings,
      description: "Remember your settings and preferences",
      required: false,
      examples: [
        "Language preferences",
        "Theme settings",
        "Layout customizations",
        "Accessibility options"
      ],
      retention: "Up to 1 year"
    }
  ]

  const thirdPartyServices = [
    {
      name: "Google Analytics",
      purpose: "Website analytics and performance monitoring",
      cookies: ["_ga", "_gid", "_gat"],
      privacy: "https://policies.google.com/privacy"
    },
    {
      name: "Stripe",
      purpose: "Payment processing and fraud prevention",
      cookies: ["__stripe_mid", "__stripe_sid"],
      privacy: "https://stripe.com/privacy"
    },
    {
      name: "Intercom",
      purpose: "Customer support and communication",
      cookies: ["intercom-*"],
      privacy: "https://www.intercom.com/legal/privacy"
    },
    {
      name: "Hotjar",
      purpose: "User experience analysis and heatmaps",
      cookies: ["_hjid", "_hjSession*"],
      privacy: "https://www.hotjar.com/legal/policies/privacy/"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Learn how AxIom uses cookies and similar technologies to enhance your experience.
          </p>
          <Badge variant="secondary" className="text-sm">
            Last updated: {lastUpdated}
          </Badge>
        </div>

        {/* Introduction */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Cookie className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-2xl">What Are Cookies?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cookies are small text files that are stored on your device when you visit our website. They help us 
              provide you with a better experience by remembering your preferences, keeping you logged in, and 
              understanding how you use our platform.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We use both first-party cookies (set by AxIom) and third-party cookies (set by our partners) to 
              deliver our services effectively. You have control over which cookies you accept.
            </p>
          </CardContent>
        </Card>

        {/* Cookie Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Types of Cookies We Use</h2>
          <div className="grid gap-6">
            {cookieTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{type.title}</CardTitle>
                          <CardDescription>{type.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {type.required ? (
                          <Badge variant="destructive">Required</Badge>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Switch id={type.id} defaultChecked />
                            <Badge variant="secondary">Optional</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Examples:</h4>
                        <ul className="space-y-2">
                          {type.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-muted-foreground">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Retention Period:</h4>
                        <p className="text-sm text-muted-foreground">{type.retention}</p>
                        {type.required && (
                          <div className="mt-3 p-3 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-orange-700 dark:text-orange-300">
                                These cookies are essential for the website to function properly and cannot be disabled.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Third-Party Services */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Third-Party Services</CardTitle>
            <CardDescription>
              We work with trusted partners who may also set cookies on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {thirdPartyServices.map((service, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{service.name}</h4>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={service.privacy} target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </Link>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{service.purpose}</p>
                  <div>
                    <span className="text-xs font-medium">Cookies: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {service.cookies.map((cookie, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {cookie}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cookie Management */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Managing Your Cookie Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Browser Settings</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  You can control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    View and delete existing cookies
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    Block cookies from specific websites
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    Block third-party cookies
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    Clear cookies when you close your browser
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Chrome</h4>
                  <p className="text-xs text-muted-foreground">Settings → Privacy and Security → Cookies and other site data</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Firefox</h4>
                  <p className="text-xs text-muted-foreground">Options → Privacy & Security → Cookies and Site Data</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Safari</h4>
                  <p className="text-xs text-muted-foreground">Preferences → Privacy → Manage Website Data</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Edge</h4>
                  <p className="text-xs text-muted-foreground">Settings → Cookies and site permissions → Cookies and site data</p>
                </div>
              </div>

              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <h4 className="font-semibold mb-2">Cookie Consent Manager</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You can also manage your cookie preferences using our consent manager, which appears when you first visit our site.
                </p>
                <Button size="sm">Update Cookie Preferences</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact of Disabling Cookies */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Impact of Disabling Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950 dark:border-red-800">
                <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300">Essential Cookies</h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Disabling essential cookies will prevent you from logging in, saving preferences, and using core features of our platform.
                </p>
              </div>
              <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                <h4 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">Analytics Cookies</h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Disabling analytics cookies means we can't understand how you use our site, which may impact our ability to improve your experience.
                </p>
              </div>
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Marketing Cookies</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Disabling marketing cookies means you may see less relevant advertisements, but won't affect core functionality.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates to Policy */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, 
              operational, or regulatory reasons. When we make changes, we will:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                Update the "Last updated" date at the top of this policy
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                Notify you through our website or email for significant changes
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                Request new consent where required by law
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Questions About Cookies?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
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
          <h2 className="text-3xl font-bold mb-6">Take Control of Your Privacy</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage your cookie preferences and learn more about how we protect your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Manage Cookie Preferences</Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/privacy">View Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}