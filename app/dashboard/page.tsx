import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { Sparkles, TrendingUp, Clock, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

import { CreditsDisplay } from '@/components/dashboard/credits'
import { AgentCard } from '@/components/dashboard/agent-card'
import { RecentGenerations } from '@/components/dashboard/recent-generations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="flex-1 space-y-8 p-6 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to create something amazing with AI?
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="px-3 py-1">
            <Sparkles className="h-4 w-4 mr-2" />
            Pro User
          </Badge>
          <CreditsDisplay />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Generations
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">24</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              +12% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              This Week
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">8</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Most active day: Tuesday
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Success Rate
            </CardTitle>
            <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">98%</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Excellent performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Tools Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold tracking-tight">AI Tools</h2>
          <Badge variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            5 Available
          </Badge>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <AgentCard 
            title="Text Generation"
            description="Create compelling content, articles, and copy with advanced AI models"
            icon="Text"
            href="/dashboard/text"
            bgColor="bg-blue-500"
          />
          <AgentCard 
            title="Code Generation"
            description="Generate clean, efficient code in multiple programming languages"
            icon="Code"
            href="/dashboard/code"
            bgColor="bg-purple-500"
          />
          <AgentCard 
            title="Image Generation"
            description="Transform your ideas into stunning visuals with AI-powered creation"
            icon="Image"
            href="/dashboard/image"
            bgColor="bg-green-500"
          />
          <AgentCard 
            title="AI Providers"
            description="Manage and configure your AI provider integrations and API keys"
            icon="Settings"
            href="/dashboard/providers"
            bgColor="bg-indigo-500"
          />
          <AgentCard 
            title="Search with AI"
            description="Get intelligent search results and answers powered by advanced AI"
            icon="Search"
            href="/dashboard/search"
            bgColor="bg-orange-500"
          />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
          <Badge variant="outline">Last 7 days</Badge>
        </div>
        <RecentGenerations />
      </div>
    </div>
  )
}