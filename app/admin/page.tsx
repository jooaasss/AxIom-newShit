'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Users, Settings, Key, Shield, Plus, Edit, Trash2, Save } from 'lucide-react'
import { apiClient, makeApiRequest } from '@/lib/axios-interceptor'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  credits: number
  isAdmin: boolean
  hasUnlimitedCredits: boolean
  createdAt: string
  _count: {
    generations: number
    purchases: number
  }
}

interface AIProvider {
  id: string
  provider: string
  apiKey: string
  isActive: boolean
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newProvider, setNewProvider] = useState({ provider: '', apiKey: '', isActive: true })

  useEffect(() => {
    checkAdminAccess()
    loadUsers()
    loadProviders()
  }, [])

  const checkAdminAccess = async () => {
    try {
      // Try to setup admin access first (for dw_940)
      await apiClient.post('/api/admin/setup')
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.')
        router.push('/dashboard')
        return
      }
    }
  }

  const loadUsers = async () => {
    const result = await makeApiRequest(
      () => apiClient.get('/api/admin/users'),
      {
        context: 'Loading users',
        customErrorMessage: 'Failed to load users'
      }
    )
    if (result) {
      setUsers(result.data)
    }
    setLoading(false)
  }

  const loadProviders = async () => {
    const result = await makeApiRequest(
      () => apiClient.get('/api/admin/providers'),
      {
        context: 'Loading AI providers',
        customErrorMessage: 'Failed to load AI providers'
      }
    )
    if (result) {
      setProviders(result.data)
    }
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    const result = await makeApiRequest(
      () => apiClient.patch('/api/admin/users', { userId, updates }),
      {
        context: 'Updating user',
        customErrorMessage: 'Failed to update user'
      }
    )
    if (result) {
      setUsers(users.map(u => u.id === userId ? { ...u, ...result.data } : u))
      setEditingUser(null)
      toast.success('User updated successfully')
    }
  }

  const addProvider = async () => {
    if (!newProvider.provider || !newProvider.apiKey) {
      toast.error('Provider name and API key are required')
      return
    }

    const result = await makeApiRequest(
      () => apiClient.post('/api/admin/providers', newProvider),
      {
        context: 'Adding AI provider',
        customErrorMessage: 'Failed to add AI provider'
      }
    )
    if (result) {
      setProviders([...providers, result.data])
      setNewProvider({ provider: '', apiKey: '', isActive: true })
      toast.success('AI provider added successfully')
    }
  }

  const deleteProvider = async (providerId: string) => {
    const result = await makeApiRequest(
      () => apiClient.delete(`/api/admin/providers?id=${providerId}`),
      {
        context: 'Deleting AI provider',
        customErrorMessage: 'Failed to delete AI provider'
      }
    )
    if (result) {
      setProviders(providers.filter(p => p.id !== providerId))
      toast.success('AI provider deleted successfully')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <p className="text-muted-foreground">Manage users, credits, and AI provider settings</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            AI Providers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, credits, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                          {user.isAdmin && <Badge variant="destructive">Admin</Badge>}
                          {user.hasUnlimitedCredits && <Badge variant="secondary">Unlimited</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Credits: {user.hasUnlimitedCredits ? '∞' : user.credits}</span>
                          <span>Generations: {user._count.generations}</span>
                          <span>Purchases: {user._count.purchases}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                AI Provider Keys
              </CardTitle>
              <CardDescription>
                Manage API keys for AI providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add new provider */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold mb-4">Add New Provider</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="provider">Provider</Label>
                    <Input
                      id="provider"
                      placeholder="e.g., openai, groq, gemini"
                      value={newProvider.provider}
                      onChange={(e) => setNewProvider({ ...newProvider, provider: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter API key"
                      value={newProvider.apiKey}
                      onChange={(e) => setNewProvider({ ...newProvider, apiKey: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addProvider} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Provider
                    </Button>
                  </div>
                </div>
              </div>

              {/* Existing providers */}
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold capitalize">{provider.provider}</h3>
                          <Badge variant={provider.isActive ? "default" : "secondary"}>
                            {provider.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">{provider.apiKey}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProvider(provider.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
              <CardDescription>Update user information and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editingUser.firstName || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editingUser.lastName || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={editingUser.credits}
                  onChange={(e) => setEditingUser({ ...editingUser, credits: parseInt(e.target.value) || 0 })}
                  disabled={editingUser.hasUnlimitedCredits}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="unlimited"
                  checked={editingUser.hasUnlimitedCredits}
                  onCheckedChange={(checked) => setEditingUser({ ...editingUser, hasUnlimitedCredits: checked })}
                />
                <Label htmlFor="unlimited">Unlimited Credits</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="admin"
                  checked={editingUser.isAdmin}
                  onCheckedChange={(checked) => setEditingUser({ ...editingUser, isAdmin: checked })}
                />
                <Label htmlFor="admin">Admin Access</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => updateUser(editingUser.id, editingUser)}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}