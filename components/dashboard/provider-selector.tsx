'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/loader'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'
import { toast } from 'sonner'
import { Check, X, Server, User } from 'lucide-react'

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
  const [error, setError] = useState<string | null>(null)
  const [apiType, setApiType] = useState<'service' | 'user'>('service')

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true)
      setError(null)
      const result = await makeApiRequest(
        () => apiClient.get(`/api/providers?type=${type}&apiType=${apiType}`),
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
      } else {
        setError('Не удалось загрузить провайдеров ИИ. Проверьте подключение к интернету.')
        setProviders([])
      }
    }

    fetchProviders()
  }, [type, apiType]) // Добавляем apiType в зависимости

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

  const renderErrorOrEmptyState = () => {
    if (error) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500 font-medium mb-2">Ошибка загрузки</p>
            <p className="text-muted-foreground mb-3">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
            >
              Попробовать снова
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (providers.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-yellow-600 font-medium mb-2">Провайдеры не настроены</p>
            <p className="text-muted-foreground">
              {apiType === 'user' 
                ? `Персональные API ключи для генерации ${type === 'text' ? 'текста' : 'изображений'} не добавлены. Добавьте ваши API ключи в настройках.`
                : `Провайдеры ИИ для генерации ${type === 'text' ? 'текста' : 'изображений'} не настроены. Проверьте переменные окружения.`
              }
            </p>
            {apiType === 'user' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => window.open('/settings', '_blank')}
              >
                Перейти в настройки
              </Button>
            )}
          </CardContent>
        </Card>
      )
    }

    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Select AI Provider</h3>
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            <Button
              variant={apiType === 'service' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setApiType('service')}
              className="h-7 px-2 text-xs rounded-lg whitespace-nowrap"
            >
              <Server className="w-3 h-3 mr-1" />
              Service API
            </Button>
            <Button
              variant={apiType === 'user' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setApiType('user')}
              className="h-7 px-2 text-xs rounded-lg whitespace-nowrap"
            >
              <User className="w-3 h-3 mr-1" />
              User API
            </Button>
          </div>
        </div>
        
        {error || providers.length === 0 ? (
          renderErrorOrEmptyState()
        ) : (
          <div className={`${providers.length > 6 ? 'space-y-1 group' : 'space-y-3'}`}>
            {providers.map((provider) => (
              <Card
                key={provider.id}
                className={`cursor-pointer transition-all duration-300 ease-in-out ${
                  selectedProvider === provider.id
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-primary/50'
                } ${
                  providers.length > 6
                    ? 'hover:scale-105 hover:shadow-lg group-hover:[&:not(:hover)]:scale-95 group-hover:[&:not(:hover)]:opacity-70'
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleProviderSelect(provider)}
              >
                <CardContent className={`${providers.length > 6 ? 'p-3' : 'p-4'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`${providers.length > 6 ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg'} rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center text-white shrink-0 transition-all duration-300`}>
                      {provider.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${providers.length > 6 ? 'text-sm' : ''}`}>{provider.name}</h4>
                      <p className={`text-muted-foreground ${providers.length > 6 ? 'text-xs' : 'text-sm'}`}>
                        {provider.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Статус провайдера */}
                      <div className={`${providers.length > 6 ? 'w-5 h-5' : 'w-6 h-6'} rounded-full flex items-center justify-center ${
                        provider.available 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`}>
                        {provider.available ? (
                          <Check className={`${providers.length > 6 ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                        ) : (
                          <X className={`${providers.length > 6 ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                        )}
                      </div>
                      {/* Selected badge */}
                      {selectedProvider === provider.id && (
                        <Badge variant="default" className={`${providers.length > 6 ? 'text-xs px-2 py-0' : ''}`}>
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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