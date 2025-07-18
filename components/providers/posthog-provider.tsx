'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_KEY !== 'your_posthog_key_here') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
  })
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  // If PostHog is not properly initialized, just return children without the provider
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY === 'your_posthog_key_here') {
    return <>{children}</>
  }

  return (
    <PostHogProvider client={posthog}>
      <PostHogAuthWrapper>{children}</PostHogAuthWrapper>
    </PostHogProvider>
  )
}

function PostHogAuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    // Only use PostHog if it's properly initialized
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_KEY !== 'your_posthog_key_here') {
      if (isLoaded && user) {
        posthog.identify(user.id, {
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        })
      } else if (isLoaded && !user) {
        posthog.reset()
      }
    }
  }, [user, isLoaded])

  return <>{children}</>
}