// Supabase Edge Function: master-dashboard
// All request handling, validation, and data access runs here.
// Client calls via: supabase.functions.invoke('master-dashboard', { body: payload })

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GetDashboardPayload {
  action: 'get_dashboard'
}

interface ApprovePayload {
  action: 'approve'
  id: string
}

interface RejectPayload {
  action: 'reject'
  id: string
}

interface ToggleCronjobPayload {
  action: 'toggle_cronjob'
  id: string
  enabled: boolean
}

type MasterDashboardPayload =
  | GetDashboardPayload
  | ApprovePayload
  | RejectPayload
  | ToggleCronjobPayload

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
    const payload: MasterDashboardPayload = await req.json()

    if (payload.action === 'get_dashboard') {
      const [cronjobsRes, runsRes] = await Promise.all([
        supabase
          .from('cronjobs_dashboard')
          .select('id, name, target, schedule, status, user_id')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
        supabase
          .from('cronjob_runs')
          .select('id, cronjob_id, status, started_at')
          .order('started_at', { ascending: false })
          .limit(20),
      ])

      const cronjobs = cronjobsRes.data ?? []
      const runs = runsRes.data ?? []

      const cronjobMap = new Map(cronjobs.map((c) => [c.id, c]))
      const runsByCronjob = new Map<string, typeof runs>()
      for (const r of runs) {
        const c = cronjobMap.get(r.cronjob_id)
        if (c && c.user_id === user.id) {
          const list = runsByCronjob.get(r.cronjob_id) ?? []
          list.push(r)
          runsByCronjob.set(r.cronjob_id, list)
        }
      }

      const activeCronjobs = cronjobs.map((c) => {
        const jobRuns = runsByCronjob.get(c.id) ?? []
        const lastRun = jobRuns[0]
        return {
          id: c.id,
          name: c.name,
          target: c.target,
          schedule: c.schedule,
          nextRun: 'In 2h',
          lastOutcome: (lastRun?.status ?? 'pending') as 'success' | 'failed' | 'running' | 'pending',
          enabled: c.status === 'active',
        }
      })

      const recentRuns = runs
        .filter((r) => cronjobMap.has(r.cronjob_id))
        .slice(0, 10)
        .map((r) => {
          const c = cronjobMap.get(r.cronjob_id)
          return {
            id: r.id,
            name: c?.name ?? 'Unknown',
            status: r.status,
            time: formatTimeAgo(r.started_at),
            logsLink: `/dashboard/cronjobs-dashboard?run=${r.id}`,
          }
        })

      const data = {
        overview: {
          liveAgentsCount: 12,
          cronjobsNextRuns: cronjobs.filter((c) => c.status === 'active').length,
          pendingApprovals: 3,
          monthlySpend: 124,
        },
        activeCronjobs,
        approvals: [
          {
            id: '1',
            action: 'Publish blog post "Getting Started with LifeOps"',
            agent: 'Content Agent',
            type: 'content' as const,
            time: '5 min ago',
            cost: '$0.02',
          },
          {
            id: '2',
            action: 'Merge PR #42: Add dashboard widgets',
            agent: 'Dev Agent',
            type: 'code' as const,
            time: '12 min ago',
            cost: '$0.05',
          },
        ],
        recentRuns,
        activityTimeline: [
          {
            id: '1',
            type: 'message' as const,
            fromAgent: 'Content Agent',
            toAgent: 'Dev Agent',
            message: 'PR #42 ready for review',
            timestamp: '2 min ago',
          },
          {
            id: '2',
            type: 'alert' as const,
            message: 'Finance Report completed successfully',
            timestamp: '15 min ago',
          },
        ],
      }

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'approve' || payload.action === 'reject') {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (payload.action === 'toggle_cronjob') {
      const { data, error } = await supabase
        .from('cronjobs_dashboard')
        .update({
          status: payload.enabled ? 'active' : 'paused',
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

function formatTimeAgo(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  return d.toLocaleDateString()
}
