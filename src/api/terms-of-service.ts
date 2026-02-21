import { apiPost } from '@/lib/api'
import type { TermsofService, TermsRevision } from '@/types/terms-of-service'

const TERMS_BASE = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL
  ? `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/terms-of-service`
  : undefined
const TERMS_PATH = TERMS_BASE ?? '/terms-of-service'

async function termsFetch<T>(body: object): Promise<T> {
  if (TERMS_BASE) {
    const res = await fetch(TERMS_PATH, {
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
