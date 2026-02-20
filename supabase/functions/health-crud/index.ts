// Supabase Edge Function: health-crud
// All request handling, validation, and data access runs here.
// Client calls via fetch to this function with Authorization header.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HealthItemPayload {
  title: string
  description?: string
  status?: string
}

interface ListPayload {
  action: 'list'
}

interface CreatePayload {
  action: 'create'
  item: HealthItemPayload
}

interface UpdatePayload {
  action: 'update'
  id: string
  updates: Partial<HealthItemPayload>
}

interface DeletePayload {
  action: 'delete'
  id: string
}

type HealthPayload = ListPayload | CreatePayload | UpdatePayload | DeletePayload

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
    const payload: HealthPayload = await req.json()

    if (payload.action === 'list') {
      const { data, error } = await supabase
        .from('health_health_module')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'create') {
      const item = payload.item
      const { data, error } = await supabase
        .from('health_health_module')
        .insert({
          user_id: user.id,
          title: item.title,
          description: item.description ?? null,
          status: item.status ?? 'active',
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
        .from('health_health_module')
        .update({
          ...payload.updates,
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
        .from('health_health_module')
        .delete()
        .eq('id', payload.id)
        .eq('user_id', user.id)
      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
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
