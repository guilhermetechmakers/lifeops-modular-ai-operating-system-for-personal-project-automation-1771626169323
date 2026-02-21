/**
 * Search Engine Service
 * Type-safe API client for full-text search across cronjobs, runs, content, and audit logs.
 * Calls Supabase Edge Function - all business logic runs server-side.
 */

import { supabase } from '@/lib/supabase'
import { apiPost } from '@/lib/api'

export type SearchEntityType = 'cronjob' | 'run' | 'content' | 'audit'

export interface SearchResult {
  id: string
  type: SearchEntityType
  title: string
  snippet?: string
  metadata: Record<string, unknown>
  score: number
  created_at: string
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  facets: { types: SearchEntityType[] }
}

export interface SearchParams {
  q: string
  types?: SearchEntityType[]
  limit?: number
  offset?: number
}

async function searchEngineInvoke<T>(body: object): Promise<T> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<T>('search-engine', { body })
    if (error) throw new Error(error.message)
    if (data == null) throw new Error('No response from search-engine')
    return data
  }
  return apiPost<T>('/search-engine', body)
}

/**
 * Execute full-text search across cronjobs, runs, content, and audit logs.
 * Supports faceted filtering by entity type and pagination.
 */
export async function search(params: SearchParams): Promise<SearchResponse> {
  const res = await searchEngineInvoke<{ data: SearchResponse }>({
    action: 'search',
    q: params.q.trim(),
    types: params.types,
    limit: params.limit,
    offset: params.offset,
  })
  if (!res.data) throw new Error('Search returned no data')
  return res.data
}
