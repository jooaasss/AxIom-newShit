'use client'

import { useState, useEffect } from 'react'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'error'
  content: string
  timestamp: Date
}

interface ChatHistory {
  [providerModelKey: string]: Message[]
}

const STORAGE_KEY = 'chat-history'

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatHistory>({})

  // Загрузка истории из localStorage при инициализации
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Преобразуем timestamp обратно в Date объекты
        const converted: ChatHistory = {}
        Object.keys(parsed).forEach(key => {
          converted[key] = parsed[key].map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })
        setChatHistory(converted)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }, [])

  // Сохранение истории в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory))
    } catch (error) {
      console.error('Error saving chat history:', error)
    }
  }, [chatHistory])

  const getProviderModelKey = (provider: string | null, model: string | null) => {
    if (!provider || !model) return 'default'
    return `${provider}-${model}`
  }

  const getMessages = (provider: string | null, model: string | null): Message[] => {
    const key = getProviderModelKey(provider, model)
    return chatHistory[key] || []
  }

  const addMessage = (provider: string | null, model: string | null, message: Message) => {
    const key = getProviderModelKey(provider, model)
    setChatHistory(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), message]
    }))
  }

  const addMessages = (provider: string | null, model: string | null, messages: Message[]) => {
    const key = getProviderModelKey(provider, model)
    setChatHistory(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), ...messages]
    }))
  }

  const clearMessages = (provider: string | null, model: string | null) => {
    const key = getProviderModelKey(provider, model)
    setChatHistory(prev => ({
      ...prev,
      [key]: []
    }))
  }

  const clearAllHistory = () => {
    setChatHistory({})
  }

  const getAllChats = () => {
    return Object.keys(chatHistory).filter(key => chatHistory[key].length > 0)
  }

  return {
    getMessages,
    addMessage,
    addMessages,
    clearMessages,
    clearAllHistory,
    getAllChats
  }
}

export type { Message, ChatHistory }