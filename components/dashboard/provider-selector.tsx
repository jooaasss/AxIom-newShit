'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/loader'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'
import { toast } from 'sonner'

export interface Provider {
  id: string
  name: string
  description: string
  icon: string
  color: string
  models: string[]
  available: boolean
}

interface ProviderSelectorProps {
  type: 'text' | 'image'
  selectedProvider: string | null
  selectedModel: string | null
  onProviderChange: (provider: string) => void
  onModelChange: (model: string) => void
}

export function ProviderSelector({
  type,
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
}: ProviderSelectorProps) {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProviders = async () => {
      const result = await makeApiRequest(
        () => apiClient.get(`/api/providers?type=${type}`),
        {
          context: 'Loading AI providers',
          customErrorMessage: 'Не удалось загрузить провайдеров ИИ.',
        }
      )
      
      setLoading(false)
      
      if (result) {
        setProviders(result.data.providers)
        
        // Auto-select first provider if none selected
        if (!selectedProvider && result.data.providers.length > 0) {
          const firstProvider = result.data.providers[0]
          onProviderChange(firstProvider.id)
          if (firstProvider.models.length > 0) {
            onModelChange(firstProvider.models[0])
          }
        }
      }
    }

    fetchProviders()
  }, [type, selectedProvider, onProviderChange, onModelChange])

  const handleProviderSelect = (provider: Provider) => {
    onProviderChange(provider.id)
    if (provider.models.length > 0) {
      onModelChange(provider.models[0])
    }
  }

  const selectedProviderData = providers.find(p => p.id === selectedProvider)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading providers...</span>
      </div>
    )
  }

  if (providers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            No AI providers configured for {type} generation.
            Please check your environment variables.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Select AI Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {providers.map((provider) => (
            <Card
              key={provider.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedProvider === provider.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleProviderSelect(provider)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center text-white text-lg`}>
                    {provider.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {provider.description}
                    </p>
                  </div>
                  {selectedProvider === provider.id && (
                    <Badge variant="default" className="shrink-0">
                      Selected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedProviderData && selectedProviderData.models.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Select Model</h3>
          <div className="flex flex-wrap gap-2">
            {selectedProviderData.models.map((model) => (
              <Button
                key={model}
                variant={selectedModel === model ? 'default' : 'outline'}
                size="sm"
                onClick={() => onModelChange(model)}
                className="text-xs"
              >
                {model}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}