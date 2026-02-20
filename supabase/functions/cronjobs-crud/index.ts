// Supabase Edge Function: cronjobs-crud
// All request handling, validation, and data access runs here.
// Client calls via: supabase.functions.invoke('cronjobs-crud', { body: payload })

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CronjobPayload {
  name: string
  title?: string
  description?: string
  schedule: string
  timezone: string
  target: string
  automation_level?: 'full' | 'assisted' | 'manual'
  status?: 'active' | 'paused' | 'draft'
  trigger_type?: 'cron' | 'manual' | 'webhook'
  payload?: Record<string, unknown>
  constraints?: string[]
  safety_rails?: string[]
  retry_policy?: { max_retries: number; backoff_ms: number }
}

interface ListPayload {
  action: 'list'
}

interface GetPayload {
  action: 'get'
  id: string
}

interface CreatePayload {
  action: 'create'
  cronjob: CronjobPayload
}

interface UpdatePayload {
  action: 'update'
  id: string
  cronjob: Partial<CronjobPayload>
}

interface DeletePayload {
  action: 'delete'
  id: string
}

interface RunNowPayload {
  action: 'run_now'
  id: string
}

interface ListRunsPayload {
  action: 'list_runs'
  cronjob_id: string
}

type CronjobsPayload =
  | ListPayload
  | GetPayload
  | CreatePayload
  | UpdatePayload
  | DeletePayload
  | RunNowPayload
  | ListRunsPayload

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
    const payload: CronjobsPayload = await req.json()

    if (payload.action === 'list') {
      const { data, error } = await supabase
        .from('cronjobs_dashboard')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'get') {
      const { data, error } = await supabase
        .from('cronjobs_dashboard')
        .select('*')
        .eq('id', payload.id)
        .eq('user_id', user.id)
        .single()
      if (error) throw error
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'create') {
      const c = payload.cronjob
      const { data, error } = await supabase
        .from('cronjobs_dashboard')
        .insert({
          user_id: user.id,
          name: c.name,
          title: c.title ?? c.name,
          description: c.description,
          schedule: c.schedule ?? '0 9 * * *',
          timezone: c.timezone ?? 'UTC',
          target: c.target,
          automation_level: c.automation_level ?? 'assisted',
          status: c.status ?? 'active',
          trigger_type: c.trigger_type ?? 'cron',
          payload: c.payload ?? {},
          constraints: c.constraints ?? [],
          safety_rails: c.safety_rails ?? [],
          retry_policy: c.retry_policy ?? { max_retries: 3, backoff_ms: 1000 },
        })
        .select()
        .single()
      if (error) throw error
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      })
    }

    if (payload.action === 'update') {
      const { data, error } = await supabase
        .from('cronjobs_dashboard')
        .update({
          ...payload.cronjob,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payload.id)
        .eq('user_id', user.id)
        .select()
        .single()
      if (error) throw error
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'delete') {
      const { error } = await supabase
        .from('cronjobs_dashboard')
        .delete()
        .eq('id', payload.id)
        .eq('user_id', user.id)
      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'run_now') {
      const { data: cronjob } = await supabase
        .from('cronjobs_dashboard')
        .select('id')
        .eq('id', payload.id)
        .eq('user_id', user.id)
        .single()
      if (!cronjob) {
        return new Response(JSON.stringify({ error: 'Cronjob not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        })
      }
      const { data: run, error } = await supabase
        .from('cronjob_runs')
        .insert({
          cronjob_id: payload.id,
          status: 'pending',
        })
        .select()
        .single()
      if (error) throw error
      return new Response(JSON.stringify({ data: run }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      })
    }

    if (payload.action === 'list_runs') {
      const { data: cronjob } = await supabase
        .from('cronjobs_dashboard')
        .select('id')
        .eq('id', payload.cronjob_id)
        .eq('user_id', user.id)
        .single()
      if (!cronjob) {
        return new Response(JSON.stringify({ error: 'Cronjob not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        })
      }
      const { data, error } = await supabase
        .from('cronjob_runs')
        .select('*')
        .eq('cronjob_id', payload.cronjob_id)
        .order('started_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
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
