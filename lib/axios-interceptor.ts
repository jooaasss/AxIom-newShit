import axios from 'axios'
import { handleErrorWithToast } from './error-handler'

// Создаем экземпляр axios с базовой конфигурацией
export const apiClient = axios.create({
  timeout: 60000, // 60 секунд
  headers: {
    'Content-Type': 'application/json',
  },
})

// Перехватчик запросов
apiClient.interceptors.request.use(
  (config) => {
    // Добавляем timestamp для отслеживания времени запроса
    config.metadata = { startTime: new Date() }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Перехватчик ответов
apiClient.interceptors.response.use(
  (response) => {
    // Логируем успешные запросы в development режиме
    if (process.env.NODE_ENV === 'development') {
      const duration = response.config.metadata?.startTime 
        ? new Date().getTime() - response.config.metadata.startTime.getTime()
        : 0
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`)
    }
    return response
  },
  (error) => {
    // Логируем ошибки
    if (process.env.NODE_ENV === 'development') {
      const duration = error.config?.metadata?.startTime 
        ? new Date().getTime() - error.config.metadata.startTime.getTime()
        : 0
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'} (${duration}ms)`)
    }

    // Автоматическая обработка определенных ошибок
    if (error.response?.status === 401) {
      // Перенаправление на страницу входа при неавторизованном доступе
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/sign-in')) {
        window.location.href = '/sign-in'
      }
    }

    return Promise.reject(error)
  }
)

// Функция для выполнения запросов с автоматической обработкой ошибок
export async function makeApiRequest<T>(
  requestFn: () => Promise<T>,
  options: {
    showErrorToast?: boolean
    context?: string
    customErrorMessage?: string
  } = {}
): Promise<T | null> {
  const { showErrorToast = true, context, customErrorMessage } = options

  try {
    return await requestFn()
  } catch (error) {
    if (showErrorToast) {
      handleErrorWithToast(error, context, customErrorMessage)
    }
    return null
  }
}

// Типы для расширения axios config
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date
    }
  }
}

export default apiClient