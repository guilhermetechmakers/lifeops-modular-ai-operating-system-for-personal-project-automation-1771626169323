import { apiPost } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import type { TermsofService, TermsRevision } from '@/types/terms-of-service'

const TERMS_PATH = '/terms-of-service'

async function termsFetch<T>(body: object): Promise<T> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<T>('terms-of-service', { body })
    if (error) throw new Error(error.message)
    if (data == null) throw new Error('No response from terms-of-service')
    return data
  }
  return apiPost<T>(TERMS_PATH, body)
}

export async function fetchTermsAccepted(): Promise<TermsofService[]> {
  const res = await termsFetch<{ data: TermsofService[] }>({ action: 'list' })
  return res.data ?? []
}

export async function fetchRevisionHistory(): Promise<TermsRevision[]> {
  const res = await termsFetch<{ data: TermsRevision[] }>({ action: 'list_revisions' })
  return res.data ?? []
}

export async function acceptTerms(version?: string, description?: string): Promise<TermsofService> {
  const res = await termsFetch<{ data: TermsofService }>({
    action: 'accept',
    version: version ?? '1.0.0',
    description,
  })
  if (!res.data) throw new Error('Failed to record acceptance')
  return res.data
}
