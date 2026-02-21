import { apiPost } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import type { Cronjob, CronjobRun } from '@/types/cronjobs'

async function cronjobsFetch<T>(body: object): Promise<T> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<T>('cronjobs-crud', { body })
    if (error) throw new Error(error.message)
    if (data == null) throw new Error('No response from cronjobs-crud')
    return data
  }
  return apiPost<T>('/cronjobs', body)
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

export async function fetchCronjobRun(
  runId: string
): Promise<{ run: CronjobRun; cronjob: Cronjob } | null> {
  try {
    const res = await cronjobsFetch<{
      data: { run: CronjobRun; cronjob: Cronjob }
    }>({ action: 'get_run', run_id: runId })
    return res.data ?? null
  } catch {
    return null
  }
}
