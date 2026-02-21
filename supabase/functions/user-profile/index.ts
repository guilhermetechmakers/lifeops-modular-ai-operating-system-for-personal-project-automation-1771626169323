// Supabase Edge Function: user-profile
// Account center: profile, settings, security, integrations, API keys, billing CTA, activity log

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function getAuthToken(req: Request): string | null {
  const auth = req.headers.get('Authorization')
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null
}

// Connectors framework catalog: GitHub, Jira, Stripe, Slack, Plaid, Health APIs, CMS
const AVAILABLE_INTEGRATIONS = [
  { id: 'github', name: 'GitHub', icon: 'github', category: 'dev', description: 'Repos, PRs, issues, CI/CD' },
  { id: 'jira', name: 'Jira', icon: 'jira', category: 'dev', description: 'Issues, sprints, project management' },
  { id: 'linear', name: 'Linear', icon: 'linear', category: 'dev', description: 'Issues and roadmap' },
  { id: 'slack', name: 'Slack', icon: 'slack', category: 'communication', description: 'Team messaging and notifications' },
  { id: 'google', name: 'Google', icon: 'google', category: 'communication', description: 'Calendar, Drive, Gmail' },
  { id: 'stripe', name: 'Stripe', icon: 'stripe', category: 'finance', description: 'Payments and subscriptions' },
  { id: 'plaid', name: 'Plaid', icon: 'plaid', category: 'finance', description: 'Bank connections and transactions' },
  { id: 'health', name: 'Health APIs', icon: 'health', category: 'health', description: 'Fitness and health device data' },
  { id: 'notion', name: 'Notion', icon: 'notion', category: 'cms', description: 'Docs and wikis' },
  { id: 'cms', name: 'CMS', icon: 'cms', category: 'cms', description: 'Content management systems' },
]

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
    const payload = await req.json()

    if (payload.action === 'get') {
      const { data: profile, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error

      const result = profile ?? {
        id: crypto.randomUUID(),
        user_id: user.id,
        title: 'Member',
        description: null,
        status: 'active',
        full_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
        avatar_url: user.user_metadata?.avatar_url,
        role: 'Member',
        organization: null,
        email: user.email,
        timezone: 'UTC',
        language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return new Response(JSON.stringify({ data: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'update') {
      const updates = payload.updates ?? {}
      const { data: existing } = await supabase
        .from('user_profile')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      const row = {
        ...updates,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      }

      let result
      if (existing) {
        const { data, error } = await supabase
          .from('user_profile')
          .update(row)
          .eq('user_id', user.id)
          .select()
          .single()
        if (error) throw error
        result = data
      } else {
        const { data, error } = await supabase
          .from('user_profile')
          .insert({ ...row, title: row.title ?? 'Member', status: row.status ?? 'active' })
          .select()
          .single()
        if (error) throw error
        result = data
      }

      return new Response(JSON.stringify({ data: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'list_integrations') {
      const { data: connected } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', user.id)

      const connectedMap = new Map((connected ?? []).map((c) => [c.integration_id, c]))
      const list = AVAILABLE_INTEGRATIONS.map((i) => ({
        id: i.id,
        name: i.name,
        icon: i.icon,
        category: i.category,
        description: i.description,
        connected: connectedMap.has(i.id),
        connected_at: connectedMap.get(i.id)?.connected_at,
      }))

      return new Response(JSON.stringify({ data: list }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'get_oauth_url') {
      const id = payload.integration_id
      const integration = AVAILABLE_INTEGRATIONS.find((i) => i.id === id)
      if (!integration) {
        return new Response(JSON.stringify({ error: 'Unknown integration' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }
      // OAuth URL generation: configure per-connector client IDs in env
      // For now return a placeholder; production would build provider-specific OAuth URL
      const baseUrl = Deno.env.get('SITE_URL') ?? 'https://app.example.com'
      const oauthUrl = `${baseUrl}/integrations/oauth/callback?provider=${id}&state=${crypto.randomUUID()}`
      return new Response(JSON.stringify({ data: { url: oauthUrl, provider: id } }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'connect_integration') {
      const id = payload.integration_id
      const integration = AVAILABLE_INTEGRATIONS.find((i) => i.id === id)
      if (!integration) {
        return new Response(JSON.stringify({ error: 'Unknown integration' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }
      await supabase.from('user_integrations').upsert(
        {
          user_id: user.id,
          integration_id: id,
          name: integration.name,
        },
        { onConflict: 'user_id,integration_id' }
      )
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'disconnect_integration') {
      await supabase
        .from('user_integrations')
        .delete()
        .eq('user_id', user.id)
        .eq('integration_id', payload.integration_id)
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'list_api_keys') {
      const { data } = await supabase
        .from('user_api_keys')
        .select('id, name, key_prefix, scope, created_at, last_used_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const list = (data ?? []).map((k) => ({
        id: k.id,
        name: k.name,
        prefix: k.key_prefix,
        scope: Array.isArray(k.scope) ? k.scope : [],
        created_at: k.created_at,
        last_used_at: k.last_used_at,
      }))

      return new Response(JSON.stringify({ data: list }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'create_api_key') {
      const name = payload.name ?? 'API Key'
      const scope = Array.isArray(payload.scope) ? payload.scope : ['read']
      const rawKey = `lk_${crypto.randomUUID().replace(/-/g, '')}`
      const prefix = rawKey.slice(0, 12) + '...'

      const { data, error } = await supabase
        .from('user_api_keys')
        .insert({
          user_id: user.id,
          name,
          key_hash: 'hashed',
          key_prefix: prefix,
          scope,
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({
          data: {
            key: rawKey,
            apiKey: {
              id: data.id,
              name: data.name,
              prefix: data.key_prefix,
              scope: data.scope ?? [],
              created_at: data.created_at,
            },
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
      )
    }

    if (payload.action === 'revoke_api_key') {
      await supabase.from('user_api_keys').delete().eq('id', payload.id).eq('user_id', user.id)
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'rotate_api_key') {
      const rawKey = `lk_${crypto.randomUUID().replace(/-/g, '')}`
      const prefix = rawKey.slice(0, 12) + '...'
      await supabase
        .from('user_api_keys')
        .update({ key_hash: 'hashed', key_prefix: prefix, last_used_at: null })
        .eq('id', payload.id)
        .eq('user_id', user.id)
      return new Response(
        JSON.stringify({ data: { key: rawKey } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if (payload.action === 'list_sessions') {
      const { data: sessions } = await supabase.auth.getUser(token)
      const list = [
        {
          id: 'current',
          device: 'Current device',
          location: 'Unknown',
          last_active: new Date().toISOString(),
          current: true,
        },
      ]
      return new Response(JSON.stringify({ data: list }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'revoke_session') {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'list_activity') {
      const limit = Math.min(payload.limit ?? 20, 100)
      const { data } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      const list = (data ?? []).map((a) => ({
        id: a.id,
        action: a.action,
        resource: a.resource,
        timestamp: a.created_at,
        ip_address: a.ip_address,
      }))

      return new Response(JSON.stringify({ data: list }), {
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
