import { apiPost } from '@/lib/api'
import type { Cronjob, CronjobRun } from '@/types/cronjobs'

// When Supabase is configured: VITE_SUPABASE_FUNCTIONS_URL = https://<project>.supabase.co/functions/v1
const CRONJOBS_BASE = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL
  ? `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/cronjobs-crud`
  : undefined
const CRONJOBS_PATH = CRONJOBS_BASE ?? '/cronjobs'

async function cronjobsFetch<T>(body: object): Promise<T> {
  if (CRONJOBS_BASE) {
    const res = await fetch(CRONJOBS_PATH, {
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
  return apiPost<T>(CRONJOBS_PATH, body)
}

export async function fetchCronjobs(): Promise<Cronjob[]> {
  const res = await cronjobsFetch<{ data: Cronjob[] }>({ action: 'list' })
  return res.data ?? []
}

export async function fetchCronjob(id: string): Promise<Cronjob | null> {
  const res = await cronjobsFetch<{ data: Cronjob }>({ action: 'get', id })
  return res.data ?? null
}

export async function createCronjob(
  cronjob: Omit<Cronjob, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Cronjob> {
  const res = await cronjobsFetch<{ data: Cronjob }>({
    action: 'create',
    cronjob,
  })
  if (!res.data) throw new Error('Failed to create cronjob')
  return res.data
}

export async function updateCronjob(
  id: string,
  cronjob: Partial<Omit<Cronjob, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Cronjob> {
  const res = await cronjobsFetch<{ data: Cronjob }>({
    action: 'update',
    id,
    cronjob,
  })
  if (!res.data) throw new Error('Failed to update cronjob')
  return res.data
}

export async function deleteCronjob(id: string): Promise<void> {
  await cronjobsFetch<unknown>({ action: 'delete', id })
}

export async function runCronjobNow(id: string): Promise<CronjobRun> {
  const res = await cronjobsFetch<{ data: CronjobRun }>({
    action: 'run_now',
    id,
  })
  if (!res.data) throw new Error('Failed to trigger run')
  return res.data
}

export async function fetchCronjobRuns(cronjobId: string): Promise<CronjobRun[]> {
  const res = await cronjobsFetch<{ data: CronjobRun[] }>({
    action: 'list_runs',
    cronjob_id: cronjobId,
  })
  return res.data ?? []
}
