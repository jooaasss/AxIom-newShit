import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Users, Lightbulb, Award, Heart, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description: "We're constantly pushing the boundaries of what's possible with AI technology to deliver cutting-edge solutions."
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Every feature we build is designed with our users in mind, ensuring the best possible experience and outcomes."
    },
    {
      icon: Heart,
      title: "Ethical AI",
      description: "We're committed to developing AI responsibly, with transparency, fairness, and safety at the core of everything we do."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Our mission is to democratize AI creation tools and make them accessible to creators worldwide."
    }
  ]

  const team = [
    {
      name: "Alex Chen",
      role: "CEO & Co-Founder",
      bio: "Former AI researcher at Google with 10+ years in machine learning and product development."
    },
    {
      name: "Sarah Johnson",
      role: "CTO & Co-Founder",
      bio: "Ex-OpenAI engineer specializing in large language models and AI infrastructure."
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Product",
      bio: "Product leader with experience at Meta and Stripe, focused on user experience and growth."
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of AI Research",
      bio: "PhD in Computer Science from Stanford, published researcher in AI safety and alignment."
    }
  ]

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Polniy was founded with the vision of making AI creation tools accessible to everyone."
    },
    {
      year: "2024",
      title: "Beta Launch",
      description: "Launched our beta platform with text and code generation capabilities to 1,000+ users."
    },
    {
      year: "2024",
      title: "Series A Funding",
      description: "Raised $15M Series A to expand our AI capabilities and grow our team."
    },
    {
      year: "2025",
      title: "Full Platform Launch",
      description: "Launched complete platform with text, code, image, and website generation tools."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            About Polniy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to democratize AI-powered creation tools and empower everyone to bring their ideas to life.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              At Polniy, we believe that creativity should have no limits. Our platform combines the power of advanced AI with intuitive design to help creators, developers, and businesses transform their ideas into reality. Whether you're writing content, building applications, creating visuals, or designing websites, we provide the tools you need to succeed in the digital age.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="secondary">{member.role}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {member.bio}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-12">Polniy by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-lg opacity-90">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2M+</div>
              <div className="text-lg opacity-90">Generations Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-lg opacity-90">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-lg opacity-90">Countries Served</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the AI revolution and help shape the future of creative technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">Get Started Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}