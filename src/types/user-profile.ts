export interface UserProfile {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
  full_name?: string
  avatar_url?: string
  role?: string
  organization?: string
  email?: string
  timezone?: string
  language?: string
}

export type IntegrationCategory = 'dev' | 'communication' | 'finance' | 'health' | 'cms'

export interface Integration {
  id: string
  name: string
  icon: string
  category?: IntegrationCategory
  description?: string
  connected: boolean
  connected_at?: string
}

export interface ApiKey {
  id: string
  name: string
  prefix: string
  scope: string[]
  created_at: string
  last_used_at?: string
}

export interface ActiveSession {
  id: string
  device: string
  location: string
  last_active: string
  current: boolean
}

export interface ActivityLogEntry {
  id: string
  action: string
  resource: string
  timestamp: string
  ip_address?: string
}
