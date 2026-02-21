import { apiPost } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import type { UserProfile, Integration, ApiKey, ActiveSession, ActivityLogEntry } from '@/types/user-profile'

async function userProfileFetch<T>(body: object): Promise<T> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<T>('user-profile', { body })
    if (error) throw new Error(error.message)
    if (data == null) throw new Error('No response from user-profile')
    return data
  }
  return apiPost<T>('/user-profile', body)
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const res = await userProfileFetch<{ data: UserProfile | null }>({ action: 'get' })
  return res.data ?? null
}

export async function updateUserProfile(
  updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'role' | 'organization' | 'email' | 'timezone' | 'language' | 'title' | 'description'>>
): Promise<UserProfile> {
  const res = await userProfileFetch<{ data: UserProfile }>({ action: 'update', updates })
  if (!res.data) throw new Error('Failed to update profile')
  return res.data
}

export async function fetchIntegrations(): Promise<Integration[]> {
  const res = await userProfileFetch<{ data: Integration[] }>({ action: 'list_integrations' })
  return res.data ?? []
}

export async function connectIntegration(integrationId: string): Promise<void> {
  await userProfileFetch<unknown>({ action: 'connect_integration', integration_id: integrationId })
}

export async function disconnectIntegration(integrationId: string): Promise<void> {
  await userProfileFetch<unknown>({ action: 'disconnect_integration', integration_id: integrationId })
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
  const res = await userProfileFetch<{ data: ApiKey[] }>({ action: 'list_api_keys' })
  return res.data ?? []
}

export async function createApiKey(name: string, scope: string[]): Promise<{ key: string; apiKey: ApiKey }> {
  const res = await userProfileFetch<{ data: { key: string; apiKey: ApiKey } }>({
    action: 'create_api_key',
    name,
    scope,
  })
  if (!res.data) throw new Error('Failed to create API key')
  return res.data
}

export async function revokeApiKey(id: string): Promise<void> {
  await userProfileFetch<unknown>({ action: 'revoke_api_key', id })
}

export async function rotateApiKey(id: string): Promise<{ key: string }> {
  const res = await userProfileFetch<{ data: { key: string } }>({ action: 'rotate_api_key', id })
  if (!res.data) throw new Error('Failed to rotate API key')
  return res.data
}

export async function fetchActiveSessions(): Promise<ActiveSession[]> {
  const res = await userProfileFetch<{ data: ActiveSession[] }>({ action: 'list_sessions' })
  return res.data ?? []
}

export async function revokeSession(id: string): Promise<void> {
  await userProfileFetch<unknown>({ action: 'revoke_session', id })
}

export async function fetchActivityLog(limit?: number): Promise<ActivityLogEntry[]> {
  const res = await userProfileFetch<{ data: ActivityLogEntry[] }>({
    action: 'list_activity',
    limit: limit ?? 20,
  })
  return res.data ?? []
}
