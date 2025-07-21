'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  tokens?: number
  cost?: number
  createdAt: Date
}

interface Chat {
  id: string
  name: string
  provider: string
  model: string
  systemPrompt?: string
  messageCount: number
  totalTokens: number
  totalCost: number
  createdAt: Date
  updatedAt: Date
  preview?: string
}

interface ChatWithMessages extends Chat {
  messages: Message[]
}

export function useDatabaseChatHistory() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<ChatWithMessages | null>(null)
  const [loading, setLoading] = useState(false)

  // Load user's chats
  const loadChats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chats')
      const data = await response.json()
      
      if (data.success) {
        setChats(data.data.chats)
      } else {
        toast.error('Failed to load chat history')
      }
    } catch (error) {
      console.error('Error loading chats:', error)
      toast.error('Failed to load chat history')
    } finally {
      setLoading(false)
    }
  }

  // Load messages for a specific chat
  const loadChatMessages = async (chatId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/chats/${chatId}/messages`)
      const data = await response.json()
      
      if (data.success) {
        const chat = chats.find(c => c.id === chatId)
        if (chat) {
          setCurrentChat({
            ...chat,
            messages: data.data.messages.map((msg: any) => ({
              ...msg,
              createdAt: new Date(msg.createdAt)
            }))
          })
        }
      } else {
        toast.error('Failed to load chat messages')
      }
    } catch (error) {
      console.error('Error loading chat messages:', error)
      toast.error('Failed to load chat messages')
    } finally {
      setLoading(false)
    }
  }

  // Create a new chat
  const createChat = async (name: string, provider: string, model: string, systemPrompt?: string) => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          provider,
          model,
          systemPrompt
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const newChat: Chat = {
          ...data.data,
          messageCount: 0,
          totalTokens: 0,
          totalCost: 0,
          createdAt: new Date(data.data.createdAt),
          updatedAt: new Date(data.data.updatedAt)
        }
        setChats(prev => [newChat, ...prev])
        setCurrentChat({
          ...newChat,
          messages: []
        })
        return newChat.id
      } else {
        toast.error('Failed to create chat')
        return null
      }
    } catch (error) {
      console.error('Error creating chat:', error)
      toast.error('Failed to create chat')
      return null
    }
  }

  // Send a message and get AI response
  const sendMessage = async (
    message: string,
    chatId: string | null,
    provider: string,
    model: string,
    systemPrompt?: string
  ) => {
    try {
      // Add user message immediately to UI
      const userMessage: Message = {
        id: `temp-user-${Date.now()}`,
        role: 'user',
        content: message,
        createdAt: new Date()
      }
      
      if (currentChat) {
        setCurrentChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, userMessage]
        } : null)
      }
      
      // Get conversation history before sending
      const conversationHistory = currentChat?.messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        })) || []

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          chatId,
          provider,
          model,
          systemPrompt,
          conversationHistory
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Reload chat messages to get the updated conversation with real IDs
        if (data.data.chatId) {
          await loadChatMessages(data.data.chatId)
          await loadChats() // Refresh chat list
        }
        return data.data
      } else {
        // Remove temporary user message on error
        if (currentChat) {
          setCurrentChat(prev => prev ? {
            ...prev,
            messages: prev.messages.filter(msg => msg.id !== userMessage.id)
          } : null)
        }
        toast.error(data.error || 'Failed to send message')
        return null
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove temporary user message on error
      if (currentChat) {
        setCurrentChat(prev => prev ? {
          ...prev,
          messages: prev.messages.filter(msg => msg.id.startsWith('temp-user-'))
        } : null)
      }
      toast.error('Failed to send message')
      return null
    }
  }

  // Delete a chat
  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats?id=${chatId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setChats(prev => prev.filter(chat => chat.id !== chatId))
        if (currentChat?.id === chatId) {
          setCurrentChat(null)
        }
        toast.success('Chat deleted successfully')
      } else {
        toast.error('Failed to delete chat')
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
      toast.error('Failed to delete chat')
    }
  }

  // Start a new chat session
  const startNewChat = () => {
    setCurrentChat(null)
  }

  // Load chats on component mount
  useEffect(() => {
    loadChats()
  }, [])

  return {
    chats,
    currentChat,
    setCurrentChat,
    loading,
    loadChats,
    loadChatMessages,
    createChat,
    sendMessage,
    deleteChat,
    startNewChat
  }
}