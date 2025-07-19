'use client'

import Link from 'next/link'
import { Code, Globe, Image, Text, Search, Settings, ArrowRight, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AgentCardProps {
  title: string
  description: string
  icon: 'Text' | 'Code' | 'Image' | 'Globe' | 'Search' | 'Settings'
  href: string
  bgColor?: string
}

export function AgentCard({
  title,
  description,
  icon,
  href,
  bgColor = 'bg-primary',
}: AgentCardProps) {
  const IconComponent = {
    Text: Text,
    Code: Code,
    Image: Image,
    Globe: Globe,
    Search: Search,
    Settings: Settings,
  }[icon]

  const gradientColors = {
    'bg-blue-500': 'from-blue-500 to-blue-600',
    'bg-purple-500': 'from-purple-500 to-purple-600',
    'bg-green-500': 'from-green-500 to-green-600',
    'bg-orange-500': 'from-orange-500 to-orange-600',
    'bg-indigo-500': 'from-indigo-500 to-indigo-600',
  }[bgColor] || 'from-blue-500 to-blue-600'

  const iconColors = {
    'bg-blue-500': 'text-blue-500',
    'bg-purple-500': 'text-purple-500',
    'bg-green-500': 'text-green-500',
    'bg-orange-500': 'text-orange-500',
    'bg-indigo-500': 'text-indigo-500',
  }[bgColor] || 'text-blue-500'

  return (
    <Link href={href} className="block group">
      <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        {/* Gradient Background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300",
          gradientColors
        )} />
        
        {/* Animated Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-pulse" />
        
        <CardHeader className="relative pb-3">
          <div className="flex items-center justify-between">
            <div className={cn(
              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
              gradientColors
            )}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </CardHeader>
        
        <CardContent className="relative pt-0">
          <CardTitle className="text-lg mb-2 group-hover:text-foreground transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
          
          {/* Status Badge */}
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}