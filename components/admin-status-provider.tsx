'use client'

import { useEffect } from 'react'
import { useAdmin } from '@/hooks/use-admin'

interface AdminStatusProviderProps {
  children: React.ReactNode
}

export function AdminStatusProvider({ children }: AdminStatusProviderProps) {
  const { isAdmin, loading } = useAdmin()

  useEffect(() => {
    if (!loading) {
      // Сохраняем статус администратора в localStorage для использования в error-handler
      try {
        localStorage.setItem('isAdmin', isAdmin.toString())
      } catch (error) {
        console.warn('Failed to save admin status to localStorage:', error)
      }
    }
  }, [isAdmin, loading])

  return <>{children}</>
}