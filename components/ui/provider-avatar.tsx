import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProviderAvatarProps {
  provider: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const PROVIDER_AVATARS: Record<string, string> = {
  openai: '/avatars/openai.svg',
  groq: '/avatars/groq.svg',
  google: '/avatars/google.svg',
  cohere: '/avatars/cohere.svg',
  huggingface: '/avatars/huggingface.svg',
  grok: '/avatars/grok.svg',
  deepseek: '/avatars/deepseek.svg',
  anthropic: '/avatars/anthropic.svg'
}

const PROVIDER_COLORS: Record<string, string> = {
  openai: 'bg-green-500',
  groq: 'bg-orange-500',
  google: 'bg-blue-500',
  cohere: 'bg-purple-500',
  huggingface: 'bg-yellow-500',
  grok: 'bg-gray-800',
  deepseek: 'bg-indigo-500',
  anthropic: 'bg-red-500'
}

const SIZE_CLASSES = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10'
}

const ICON_SIZE_CLASSES = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
}

export function ProviderAvatar({ provider, className, size = 'md' }: ProviderAvatarProps) {
  const avatarUrl = PROVIDER_AVATARS[provider.toLowerCase()]
  const fallbackColor = PROVIDER_COLORS[provider.toLowerCase()] || 'bg-blue-500'
  
  return (
    <div className={cn(
      'rounded-full flex items-center justify-center shrink-0',
      SIZE_CLASSES[size],
      !avatarUrl && fallbackColor,
      className
    )}>
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={`${provider} avatar`}
          className={cn('rounded-full object-cover', SIZE_CLASSES[size])}
          onError={(e) => {
            // Fallback to colored background with icon if image fails to load
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.className = cn(
                parent.className,
                fallbackColor
              )
              const icon = document.createElement('div')
              icon.innerHTML = `<svg class="${ICON_SIZE_CLASSES[size]} text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`
              parent.appendChild(icon)
            }
          }}
        />
      ) : (
        <Bot className={cn(ICON_SIZE_CLASSES[size], 'text-white')} />
      )}
    </div>
  )
}