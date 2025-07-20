'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { apiClient } from '@/lib/axios-interceptor'

interface AdminStatus {
  isAdmin: boolean
  loading: boolean
  error: string | null
}

export function useAdmin(): AdminStatus {
  const { user, isLoaded } = useUser()
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({
    isAdmin: false,
    loading: true,
    error: null
  })

  useEffect(() => {
    if (!isLoaded || !user) {
      setAdminStatus({ isAdmin: false, loading: false, error: null })
      return
    }

    const checkAdminStatus = async () => {
      try {
        // Проверяем по email администратора
        const isAdminByEmail = user.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL
        
        if (isAdminByEmail) {
          setAdminStatus({ isAdmin: true, loading: false, error: null })
          return
        }

        // Дополнительная проверка через API
        const response = await apiClient.get('/api/user/profile')
        const userData = response.data
        
        setAdminStatus({
          isAdmin: userData.isAdmin || false,
          loading: false,
          error: null
        })
      } catch (error) {
        setAdminStatus({
          isAdmin: false,
          loading: false,
          error: 'Failed to check admin status'
        })
      }
    }

    checkAdminStatus()
  }, [user, isLoaded])

  return adminStatus
}