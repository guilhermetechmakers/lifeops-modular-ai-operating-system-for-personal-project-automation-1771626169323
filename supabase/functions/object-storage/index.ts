// Supabase Edge Function: object-storage (S3-compatible)
// Run artifacts, diffs, logs, exported artifacts. Signed URLs, per-tenant access.
// Client calls via: supabase.functions.invoke('object-storage', { body: payload })

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BUCKET = 'run-artifacts'
const SIGNED_URL_EXPIRY_SEC = 3600 // 1 hour

interface GetSignedUrlsPayload {
  action: 'get_signed_urls'
  run_id: string
  artifact_types?: ('logs' | 'diff' | 'artifact' | 'export')[]
}

interface ListArtifactsPayload {
  action: 'list_artifacts'
  run_id: string
}

interface ExportArtifactPayload {
  action: 'export_artifact'
  run_id: string
  artifact_type: 'logs' | 'diff' | 'artifact' | 'export'
  filename: string
}

type ObjectStoragePayload = GetSignedUrlsPayload | ListArtifactsPayload | ExportArtifactPayload

function getAuthToken(req: Request): string | null {
  const auth = req.headers.get('Authorization')
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null
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
    const payload: ObjectStoragePayload = await req.json()

    if (payload.action === 'get_signed_urls') {
      const { run_id, artifact_types } = payload
      const types = artifact_types ?? ['logs', 'diff', 'artifact', 'export']

      const { data: artifacts, error } = await supabase
        .from('run_artifacts')
        .select('id, storage_key, artifact_type, filename')
        .eq('run_id', run_id)
        .eq('user_id', user.id)
        .in('artifact_type', types)

      if (error) throw error

      const urls: { key: string; url: string; type: string; filename: string }[] = []
      for (const a of artifacts ?? []) {
        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(a.storage_key, SIGNED_URL_EXPIRY_SEC)
        if (signed?.signedUrl) {
          urls.push({
            key: a.storage_key,
            url: signed.signedUrl,
            type: a.artifact_type,
            filename: a.filename,
          })
        }
      }

      return new Response(
        JSON.stringify({ data: { urls } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if (payload.action === 'list_artifacts') {
      const { run_id } = payload
      const { data, error } = await supabase
        .from('run_artifacts')
        .select('id, artifact_type, filename, size_bytes, created_at')
        .eq('run_id', run_id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(
        JSON.stringify({ data: { artifacts: data ?? [] } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if (payload.action === 'export_artifact') {
      const { run_id, artifact_type, filename } = payload
      const storageKey = `${user.id}/${run_id}/${artifact_type}/${filename}`

      const { data: signed, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(storageKey, SIGNED_URL_EXPIRY_SEC)

      if (error || !signed?.signedUrl) {
        return new Response(
          JSON.stringify({ error: 'Artifact not found or access denied' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      return new Response(
        JSON.stringify({ data: { url: signed.signedUrl, filename } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
