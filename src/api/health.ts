import { apiPost } from '@/lib/api'
import type { HealthHealthModule } from '@/types/health'

const HEALTH_BASE = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL
  ? `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/health-crud`
  : undefined
const HEALTH_PATH = HEALTH_BASE ?? '/health'

async function healthFetch<T>(body: object): Promise<T> {
  if (HEALTH_BASE) {
    const res = await fetch(HEALTH_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as { error?: string }).error ?? res.statusText)
    }
    return res.json()
  }
  return apiPost<T>(HEALTH_PATH, body)
}

export async function fetchHealthItems(): Promise<HealthHealthModule[]> {
  const res = await healthFetch<{ data: HealthHealthModule[] }>({ action: 'list' })
  return res.data ?? []
}

export async function createHealthItem(
  item: Omit<HealthHealthModule, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<HealthHealthModule> {
  const res = await healthFetch<{ data: HealthHealthModule }>({
    action: 'create',
    item: {
      title: item.title,
      description: item.description,
      status: item.status ?? 'active',
    },
  })
  if (!res.data) throw new Error('Failed to create health item')
  return res.data
}

export async function updateHealthItem(
  id: string,
  updates: Partial<Pick<HealthHealthModule, 'title' | 'description' | 'status'>>
): Promise<HealthHealthModule> {
  const res = await healthFetch<{ data: HealthHealthModule }>({
    action: 'update',
    id,
    updates,
  })
  if (!res.data) throw new Error('Failed to update health item')
  return res.data
}

export async function deleteHealthItem(id: string): Promise<void> {
  await healthFetch<unknown>({ action: 'delete', id })
}
