'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Cookie, Shield, BarChart3, Target, Settings, X } from 'lucide-react'
import Link from 'next/link'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

interface CookieConsentManagerProps {
  onPreferencesChange?: (preferences: CookiePreferences) => void
}

const COOKIE_CONSENT_KEY = 'axiom-cookie-consent'
const COOKIE_PREFERENCES_KEY = 'axiom-cookie-preferences'

const cookieTypes = [
  {
    id: 'essential' as keyof CookiePreferences,
    title: 'Essential Cookies',
    icon: Shield,
    description: 'Required for basic website functionality',
    required: true,
    examples: ['Authentication', 'Session management', 'Security'],
  },
  {
    id: 'analytics' as keyof CookiePreferences,
    title: 'Analytics Cookies',
    icon: BarChart3,
    description: 'Help us understand how visitors use our website',
    required: false,
    examples: ['Page views', 'User behavior', 'Performance metrics'],
  },
  {
    id: 'marketing' as keyof CookiePreferences,
    title: 'Marketing Cookies',
    icon: Target,
    description: 'Used to deliver relevant advertisements',
    required: false,
    examples: ['Ad personalization', 'Campaign tracking', 'Retargeting'],
  },
  {
    id: 'preferences' as keyof CookiePreferences,
    title: 'Preference Cookies',
    icon: Settings,
    description: 'Remember your settings and preferences',
    required: false,
    examples: ['Language', 'Theme settings', 'Layout customizations'],
  },
]

export function CookieConsentBanner({ onPreferencesChange }: CookieConsentManagerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showManager, setShowManager] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!hasConsent) {
      setShowBanner(true)
    } else {
      // Load saved preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences)
          setPreferences(parsed)
          onPreferencesChange?.(parsed)
        } catch (error) {
          console.error('Error parsing cookie preferences:', error)
        }
      }
    }
  }, [])

  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences))
    setPreferences(newPreferences)
    onPreferencesChange?.(newPreferences)
    setShowBanner(false)
    setShowManager(false)
  }

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    savePreferences(allAccepted)
  }

  const acceptEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    savePreferences(essentialOnly)
  }

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'essential') return // Essential cookies cannot be disabled
    
    const newPreferences = {
      ...preferences,
      [type]: value,
    }
    setPreferences(newPreferences)
  }

  const saveCustomPreferences = () => {
    savePreferences(preferences)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Cookie className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">We use cookies</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                  You can manage your preferences or learn more in our{' '}
                  <Link href="/cookies" className="underline hover:no-underline">
                    cookie policy
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowManager(true)}
                className="w-full md:w-auto"
              >
                Manage Preferences
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={acceptEssential}
                className="w-full md:w-auto"
              >
                Essential Only
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="w-full md:w-auto"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Manager Dialog */}
      <Dialog open={showManager} onOpenChange={setShowManager}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Choose which cookies you want to accept. Essential cookies are required for the website to function properly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {cookieTypes.map((type) => {
              const Icon = type.icon
              const isEnabled = preferences[type.id]
              
              return (
                <Card key={type.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{type.title}</CardTitle>
                          <CardDescription className="text-sm">{type.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {type.required ? (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        ) : (
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => handlePreferenceChange(type.id, checked)}
                          />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Examples: </span>
                      {type.examples.join(', ')}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <div className="flex flex-col gap-2 pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={acceptEssential}
                className="flex-1"
              >
                Essential Only
              </Button>
              <Button
                onClick={saveCustomPreferences}
                className="flex-1"
              >
                Save Preferences
              </Button>
              <Button
                onClick={acceptAll}
                className="flex-1"
              >
                Accept All
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              You can change these settings at any time in our{' '}
              <Link href="/cookies" className="underline hover:no-underline">
                cookie policy
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function CookieConsentManager({ onPreferencesChange }: CookieConsentManagerProps) {
  const [showManager, setShowManager] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    // Load saved preferences
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences(parsed)
      } catch (error) {
        console.error('Error parsing cookie preferences:', error)
      }
    }
  }, [])

  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences))
    setPreferences(newPreferences)
    onPreferencesChange?.(newPreferences)
    setShowManager(false)
  }

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    savePreferences(allAccepted)
  }

  const acceptEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    savePreferences(essentialOnly)
  }

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'essential') return // Essential cookies cannot be disabled
    
    const newPreferences = {
      ...preferences,
      [type]: value,
    }
    setPreferences(newPreferences)
  }

  const saveCustomPreferences = () => {
    savePreferences(preferences)
  }

  return (
    <Dialog open={showManager} onOpenChange={setShowManager}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Manage Cookie Preferences
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Cookie Preferences
          </DialogTitle>
          <DialogDescription>
            Choose which cookies you want to accept. Essential cookies are required for the website to function properly.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {cookieTypes.map((type) => {
            const Icon = type.icon
            const isEnabled = preferences[type.id]
            
            return (
              <Card key={type.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{type.title}</CardTitle>
                        <CardDescription className="text-sm">{type.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {type.required ? (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      ) : (
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => handlePreferenceChange(type.id, checked)}
                        />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Examples: </span>
                    {type.examples.join(', ')}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <div className="flex flex-col gap-2 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={acceptEssential}
              className="flex-1"
            >
              Essential Only
            </Button>
            <Button
              onClick={saveCustomPreferences}
              className="flex-1"
            >
              Save Preferences
            </Button>
            <Button
              onClick={acceptAll}
              className="flex-1"
            >
              Accept All
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            You can change these settings at any time in our{' '}
            <Link href="/cookies" className="underline hover:no-underline">
              cookie policy
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook to get current cookie preferences
export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences(parsed)
      } catch (error) {
        console.error('Error parsing cookie preferences:', error)
      }
    }
  }, [])

  return preferences
}

export type { CookiePreferences }