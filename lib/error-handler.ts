import { toast } from 'sonner'
import { logError, getErrorMessage } from './utils'

// Функция для проверки, является ли пользователь администратором
function isUserAdmin(): boolean {
  if (typeof window === 'undefined') return false
  
  // Проверяем localStorage на наличие информации об администраторе
  try {
    const adminStatus = localStorage.getItem('isAdmin')
    return adminStatus === 'true'
  } catch {
    return false
  }
}

// Типы ошибок
export interface AppError extends Error {
  code?: string
  statusCode?: number
  context?: Record<string, any>
}

// Создание кастомной ошибки
export function createError(
  message: string,
  code?: string,
  statusCode?: number,
  context?: Record<string, any>
): AppError {
  const error = new Error(message) as AppError
  error.code = code
  error.statusCode = statusCode
  error.context = context
  return error
}

// Функция для извлечения детального текста ошибки
function extractDetailedErrorMessage(error: any): string | null {
  // Приоритет извлечения сообщений об ошибках
  const errorSources = [
    error?.error?.message,
    error?.error,
    error?.message,
    error?.response?.data?.error?.message,
    error?.response?.data?.error,
    error?.response?.data?.message,
    error?.response?.statusText,
    error?.statusText,
    error?.toString?.()
  ]

  for (const source of errorSources) {
    if (source && typeof source === 'string' && source.trim()) {
      return source.trim()
    }
  }

  // Проверяем специфичные коды ошибок
  if (error?.code) {
    const errorCodeMessages: Record<string, string> = {
      'invalid_api_key': 'Недействительный API ключ',
      'account_deactivated': 'Аккаунт деактивирован',
      'insufficient_quota': 'Недостаточно квоты',
      'rate_limit_exceeded': 'Превышен лимит запросов',
      'model_not_found': 'Модель не найдена',
      'context_length_exceeded': 'Превышена длина контекста'
    }
    
    if (errorCodeMessages[error.code]) {
      return errorCodeMessages[error.code]
    }
  }

  return null
}

function extractProviderInfo(error: any): string | null {
  // Извлекаем информацию о провайдере из различных источников
  const providerSources = [
    error?.provider,
    error?.config?.provider,
    error?.response?.headers?.['x-provider'],
    error?.response?.config?.provider,
    error?.request?.provider
  ]

  for (const source of providerSources) {
    if (source && typeof source === 'string') {
      return source
    }
  }

  // Пытаемся определить провайдера по URL
  const url = error?.config?.url || error?.response?.config?.url || error?.request?.url
  if (url && typeof url === 'string') {
    if (url.includes('openai')) return 'OpenAI'
    if (url.includes('anthropic')) return 'Anthropic'
    if (url.includes('groq')) return 'Groq'
    if (url.includes('huggingface')) return 'Hugging Face'
    if (url.includes('cohere')) return 'Cohere'
    if (url.includes('google')) return 'Google'
    if (url.includes('deepseek')) return 'DeepSeek'
  }

  return null
}

function extractErrorContext(error: any): string | null {
  const contextInfo = []

  // Добавляем информацию о модели
  const model = error?.model || error?.config?.model || error?.response?.config?.model
  if (model) {
    contextInfo.push(`Модель: ${model}`)
  }

  // Добавляем информацию о запросе
  const requestId = error?.response?.headers?.['x-request-id'] || error?.requestId
  if (requestId) {
    contextInfo.push(`ID запроса: ${requestId}`)
  }

  // Добавляем информацию о лимитах
  const rateLimitInfo = extractRateLimitInfo(error)
  if (rateLimitInfo) {
    contextInfo.push(rateLimitInfo)
  }

  // Добавляем специфичную информацию об ошибке
  if (error?.response?.status === 429) {
    contextInfo.push('Слишком много запросов - попробуйте позже')
  }

  if (error?.response?.status === 401) {
    contextInfo.push('Проблема с аутентификацией - проверьте API ключ')
  }

  if (error?.response?.status === 403) {
    contextInfo.push('Доступ запрещен - проверьте права доступа')
  }

  return contextInfo.length > 0 ? contextInfo.join('\n') : null
}

function extractRateLimitInfo(error: any): string | null {
  const headers = error?.response?.headers
  if (!headers) return null

  const rateLimitInfo = []
  
  if (headers['x-ratelimit-remaining']) {
    rateLimitInfo.push(`Осталось запросов: ${headers['x-ratelimit-remaining']}`)
  }
  
  if (headers['x-ratelimit-reset']) {
    const resetTime = new Date(parseInt(headers['x-ratelimit-reset']) * 1000)
    rateLimitInfo.push(`Сброс лимита: ${resetTime.toLocaleTimeString('ru-RU')}`)
  }
  
  if (headers['retry-after']) {
    rateLimitInfo.push(`Повторить через: ${headers['retry-after']} сек`)
  }

  return rateLimitInfo.length > 0 ? rateLimitInfo.join(', ') : null
}

// Обработка ошибок API
export function handleApiError(error: any, context?: string): string {
  let errorMessage = 'Произошла неожиданная ошибка'
  
  // Сначала пытаемся извлечь детальное сообщение
  const detailedMessage = extractDetailedErrorMessage(error)
  
  if (error?.response) {
    // Ошибка от сервера
    const status = error.response.status
    const data = error.response.data
    
    // Используем детальное сообщение, если оно есть, иначе стандартное
    switch (status) {
      case 400:
        errorMessage = detailedMessage || data?.error || 'Неверные данные запроса'
        break
      case 401:
        errorMessage = detailedMessage || 'Необходима авторизация'
        break
      case 402:
        errorMessage = detailedMessage || 'Недостаточно кредитов'
        break
      case 403:
        errorMessage = detailedMessage || 'Доступ запрещен'
        break
      case 404:
        errorMessage = detailedMessage || 'Ресурс не найден'
        break
      case 429:
        errorMessage = detailedMessage || 'Слишком много запросов. Попробуйте позже'
        break
      case 500:
        errorMessage = detailedMessage || 'Ошибка сервера. Попробуйте позже'
        break
      default:
        errorMessage = detailedMessage || data?.error || `Ошибка сервера (${status})`
    }
  } else if (error?.request) {
    // Ошибка сети
    errorMessage = detailedMessage || 'Ошибка сети. Проверьте подключение к интернету'
  } else {
    // Другие ошибки
    errorMessage = detailedMessage || getErrorMessage(error)
  }
  
  logError(error, context)
  return errorMessage
}

// Глобальный обработчик ошибок с уведомлениями
export function handleErrorWithToast(
  error: any,
  context?: string,
  customMessage?: string
): void {
  const errorMessage = customMessage || handleApiError(error, context)
  const isAdmin = isUserAdmin()
  
  // Для администраторов показываем детали ошибки
  if (isAdmin) {
    // Извлекаем оригинальный текст ошибки от провайдера
    const originalError = extractDetailedErrorMessage(error)
    
    const errorDetails = {
      message: errorMessage,
      originalError: originalError,
      status: error?.response?.status || error?.status,
      statusText: error?.response?.statusText || error?.statusText,
      url: error?.config?.url || error?.request?.responseURL,
      method: error?.config?.method?.toUpperCase() || error?.request?.method,
      context: context,
      timestamp: new Date().toISOString(),
      // Дополнительные детали для разных типов ошибок
      errorCode: error?.code,
      errorType: error?.name || error?.constructor?.name
    }
    
    // Формируем детальное сообщение для администратора
    // Используем оригинальную ошибку как основное сообщение, если она отличается от обработанного
    const mainErrorMessage = originalError || errorMessage
    let adminMessage = `🚨 Ошибка: ${mainErrorMessage}`
    
    // Показываем обработанное сообщение только если оно отличается от оригинального
    if (originalError && originalError !== errorMessage && errorMessage !== 'Произошла неожиданная ошибка') {
      adminMessage += `\n\n📋 Обработанное сообщение:\n${errorMessage}`
    }
    
    // Добавляем информацию о провайдере, если доступна
    const providerInfo = extractProviderInfo(error)
    if (providerInfo) {
      adminMessage += `\n\n🔌 Провайдер: ${providerInfo}`
    }
    
    // Добавляем специфичную информацию об ошибке
    const errorContext = extractErrorContext(error)
    if (errorContext) {
      adminMessage += `\n\n💡 Контекст ошибки:\n${errorContext}`
    }
    
    adminMessage += `\n\n🔧 Технические детали:\n` +
      `• Статус: ${errorDetails.status || 'N/A'}\n` +
      `• Тип: ${errorDetails.errorType || 'N/A'}\n` +
      `• Код: ${errorDetails.errorCode || 'N/A'}\n` +
      `• URL: ${errorDetails.url || 'N/A'}\n` +
      `• Метод: ${errorDetails.method || 'N/A'}\n` +
      `• Контекст: ${errorDetails.context || 'N/A'}\n` +
      `• Время: ${new Date().toLocaleString('ru-RU')}`
    
    toast.error(adminMessage, {
      duration: 15000, // Увеличиваем время показа для администраторов
      style: {
        maxWidth: '600px',
        whiteSpace: 'pre-line',
        fontSize: '13px'
      }
    })
  } else {
    toast.error(errorMessage)
  }
  
  // Отправка в систему мониторинга
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture('error_occurred', {
      error: getErrorMessage(error),
      context,
      stack: error?.stack,
      url: window.location.href,
      isAdmin
    })
  }
}

// Wrapper для async функций с обработкой ошибок
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string,
  showToast = true
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args)
    } catch (error) {
      if (showToast) {
        handleErrorWithToast(error, context)
      } else {
        logError(error, context)
      }
      return null
    }
  }
}

// Retry функция с экспоненциальной задержкой
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  context?: string
): Promise<T> {
  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        logError(error, `${context} - Final attempt failed`)
        throw error
      }
      
      const delay = baseDelay * Math.pow(2, attempt)
      logError(error, `${context} - Attempt ${attempt + 1} failed, retrying in ${delay}ms`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

// Обработчик для форм
export function handleFormError(
  error: any,
  setError?: (field: string, error: { message: string }) => void
): void {
  if (error?.response?.data?.errors) {
    // Обработка ошибок валидации
    const errors = error.response.data.errors
    Object.keys(errors).forEach(field => {
      if (setError) {
        setError(field, { message: errors[field][0] })
      }
    })
  } else {
    handleErrorWithToast(error, 'Form submission')
  }
}

// Проверка доступности сервиса
export async function checkServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/health')
    return response.ok
  } catch (error) {
    logError(error, 'Health check failed')
    return false
  }
}

// Обработчик для загрузки файлов
export function handleFileUploadError(error: any): string {
  if (error?.response?.status === 413) {
    return 'Файл слишком большой. Максимальный размер: 10MB'
  }
  
  if (error?.response?.status === 415) {
    return 'Неподдерживаемый тип файла'
  }
  
  return handleApiError(error, 'File upload')
}

// Типы для TypeScript
export type ErrorHandler = (error: any, context?: string) => void
export type AsyncErrorHandler<T> = (error: any, context?: string) => Promise<T | null>

// Константы для кодов ошибок
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  RATE_LIMITED: 'RATE_LIMITED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]