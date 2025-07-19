'use client'

import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProviderAvatarProps {
  provider: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const PROVIDER_AVATARS: Record<string, string> = {
  openai: '/avatars/openai.svg',
  google: '/avatars/google.svg',
  groq: '/avatars/groq.svg',
  anthropic: '/avatars/anthropic.svg',
  cohere: '/avatars/cohere.svg',
  huggingface: '/avatars/huggingface.svg',
  grok: '/avatars/grok.svg',
  deepseek: '/avatars/deepseek.svg',
}

const PROVIDER_COLORS: Record<string, string> = {
  openai: 'bg-green-500',
  google: 'bg-blue-500',
  groq: 'bg-orange-500',
  anthropic: 'bg-purple-500',
  cohere: 'bg-pink-500',
  huggingface: 'bg-yellow-500',
  grok: 'bg-gray-500',
  deepseek: 'bg-indigo-500',
}

const SIZE_CLASSES = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

const ICON_SIZE_CLASSES = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
}

export function ProviderAvatar({ provider, size = 'md', className }: ProviderAvatarProps) {
  const avatarPath = provider ? PROVIDER_AVATARS[provider] : null
  const fallbackColor = provider ? PROVIDER_COLORS[provider] || 'bg-gray-500' : 'bg-gray-500'
  
  if (avatarPath) {
    return (
      <img
        src={avatarPath}
        alt={`${provider} avatar`}
        className={cn(
          SIZE_CLASSES[size],
          'rounded-full object-cover shrink-0',
          className
        )}
        onError={(e) => {
          // Fallback to colored background with icon if image fails to load
          const target = e.target as HTMLImageElement
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `
              <div class="${SIZE_CLASSES[size]} ${fallbackColor} rounded-full flex items-center justify-center shrink-0 ${className || ''}">
                <svg class="${ICON_SIZE_CLASSES[size]} text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
            `
          }
        }}
      />
    )
  }
  
  // Fallback to colored background with Bot icon
  return (
    <div className={cn(
      SIZE_CLASSES[size],
      fallbackColor,
      'rounded-full flex items-center justify-center shrink-0',
      className
    )}>
      <Bot className={cn(ICON_SIZE_CLASSES[size], 'text-white')} />
    </div>
  )
}