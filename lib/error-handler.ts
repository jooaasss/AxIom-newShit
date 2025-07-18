import { toast } from 'sonner'
import { logError, getErrorMessage } from './utils'

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

// Обработка ошибок API
export function handleApiError(error: any, context?: string): string {
  let errorMessage = 'Произошла неожиданная ошибка'
  
  if (error?.response) {
    // Ошибка от сервера
    const status = error.response.status
    const data = error.response.data
    
    switch (status) {
      case 400:
        errorMessage = data?.error || 'Неверные данные запроса'
        break
      case 401:
        errorMessage = 'Необходима авторизация'
        break
      case 402:
        errorMessage = 'Недостаточно кредитов'
        break
      case 403:
        errorMessage = 'Доступ запрещен'
        break
      case 404:
        errorMessage = 'Ресурс не найден'
        break
      case 429:
        errorMessage = 'Слишком много запросов. Попробуйте позже'
        break
      case 500:
        errorMessage = 'Ошибка сервера. Попробуйте позже'
        break
      default:
        errorMessage = data?.error || `Ошибка сервера (${status})`
    }
  } else if (error?.request) {
    // Ошибка сети
    errorMessage = 'Ошибка сети. Проверьте подключение к интернету'
  } else {
    // Другие ошибки
    errorMessage = getErrorMessage(error)
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
  
  toast.error(errorMessage)
  
  // Отправка в систему мониторинга
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture('error_occurred', {
      error: getErrorMessage(error),
      context,
      stack: error?.stack,
      url: window.location.href,
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