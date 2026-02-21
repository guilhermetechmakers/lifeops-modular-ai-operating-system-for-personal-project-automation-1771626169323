// Supabase Edge Function: search-engine
// Full-text and faceted search for cronjobs, agents, runs, content, and audit logs.
// All request handling, validation, and data access runs here.
// Client calls via: supabase.functions.invoke('search-engine', { body: payload })

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_QUERY_LENGTH = 200
const MAX_LIMIT = 50
const DEFAULT_LIMIT = 20

type SearchEntityType = 'cronjob' | 'run' | 'content' | 'audit'

interface SearchPayload {
  action: 'search'
  q: string
  types?: SearchEntityType[]
  limit?: number
  offset?: number
}

function getAuthToken(req: Request): string | null {
  const auth = req.headers.get('Authorization')
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null
}

/** Escape ilike pattern: % and _ are wildcards */
function escapeIlikePattern(s: string): string {
  return s.replace(/[%_\\]/g, (c) => `\\${c}`)
}

/** Build ilike pattern for contains search. Replaces commas to avoid breaking PostgREST or() parsing. */
function toIlikePattern(q: string): string {
  const sanitized = q.trim().replace(/,/g, ' ')
  const escaped = escapeIlikePattern(sanitized)
  return `%${escaped}%`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const token = getAuthToken(req)
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  try {
    const payload = (await req.json()) as SearchPayload

    if (payload.action !== 'search') {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const rawQuery = typeof payload.q === 'string' ? payload.q.trim() : ''
    if (!rawQuery || rawQuery.length > MAX_QUERY_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'Query required (max 200 chars)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const types = Array.isArray(payload.types)
      ? payload.types.filter((t) => ['cronjob', 'run', 'content', 'audit'].includes(t))
      : (['cronjob', 'run', 'content', 'audit'] as SearchEntityType[])

    const limit = Math.min(Math.max(1, payload.limit ?? DEFAULT_LIMIT), MAX_LIMIT)
    const offset = Math.max(0, payload.offset ?? 0)
    const fetchLimit = limit + offset + 20 // Fetch extra to fill combined result set

    const pattern = toIlikePattern(rawQuery)
    const results: Array<{
      id: string
      type: SearchEntityType
      title: string
      snippet?: string
      metadata: Record<string, unknown>
      score: number
      created_at: string
    }> = []

    // Search cronjobs_dashboard
    if (types.includes('cronjob')) {
      const { data: cronjobs } = await supabase
        .from('cronjobs_dashboard')
        .select('id, name, title, description, target, status, created_at')
        .eq('user_id', user.id)
        .or(`name.ilike.${pattern},title.ilike.${pattern},description.ilike.${pattern},target.ilike.${pattern}`)
        .order('updated_at', { ascending: false })
        .range(0, fetchLimit - 1)

      for (const c of cronjobs ?? []) {
        const title = c.title ?? c.name ?? 'Untitled'
        const snippet = [c.description, c.target].filter(Boolean).join(' · ') || undefined
        results.push({
          id: c.id,
          type: 'cronjob',
          title,
          snippet: snippet?.slice(0, 120),
          metadata: { status: c.status, target: c.target },
          score: 1,
          created_at: c.created_at,
        })
      }
    }

    // Search cronjob_runs (RLS filters via cronjob ownership)
    if (types.includes('run')) {
      const { data: runs } = await supabase
        .from('cronjob_runs')
        .select('id, cronjob_id, status, logs, error, started_at, cronjobs_dashboard(name)')
        .or(`logs.ilike.${pattern},error.ilike.${pattern},status.ilike.${pattern}`)
        .order('started_at', { ascending: false })
        .range(0, fetchLimit - 1)

      for (const r of runs ?? []) {
        const cronjob = r.cronjobs_dashboard as { name?: string } | null
        const title = cronjob?.name ? `Run: ${cronjob.name}` : `Run ${r.id.slice(0, 8)}`
        const snippet = (r.logs ?? r.error ?? '').slice(0, 120) || undefined
        results.push({
          id: r.id,
          type: 'run',
          title,
          snippet,
          metadata: { status: r.status, cronjob_id: r.cronjob_id },
          score: 1,
          created_at: r.started_at,
        })
      }
    }

    // Search run_artifacts (content)
    if (types.includes('content')) {
      const { data: artifacts } = await supabase
        .from('run_artifacts')
        .select('id, run_id, filename, artifact_type, created_at')
        .eq('user_id', user.id)
        .ilike('filename', pattern)
        .order('created_at', { ascending: false })
        .range(0, fetchLimit - 1)

      for (const a of artifacts ?? []) {
        results.push({
          id: a.id,
          type: 'content',
          title: a.filename,
          metadata: { run_id: a.run_id, artifact_type: a.artifact_type },
          score: 1,
          created_at: a.created_at,
        })
      }
    }

    // Search user_activity_log (audit)
    if (types.includes('audit')) {
      const { data: logs } = await supabase
        .from('user_activity_log')
        .select('id, action, resource, created_at')
        .eq('user_id', user.id)
        .or(`action.ilike.${pattern},resource.ilike.${pattern}`)
        .order('created_at', { ascending: false })
        .range(0, fetchLimit - 1)

      for (const l of logs ?? []) {
        results.push({
          id: l.id,
          type: 'audit',
          title: `${l.action}: ${l.resource}`,
          metadata: { action: l.action, resource: l.resource },
          score: 1,
          created_at: l.created_at,
        })
      }
    }

    // Sort by created_at desc and apply pagination
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const paginated = results.slice(offset, offset + limit)

    return new Response(
      JSON.stringify({
        data: {
          results: paginated,
          total: results.length,
          query: rawQuery,
          facets: { types },
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
