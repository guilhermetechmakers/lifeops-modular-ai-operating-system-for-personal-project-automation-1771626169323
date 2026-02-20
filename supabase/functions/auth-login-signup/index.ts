// Supabase Edge Function: auth-login-signup
// All request handling, validation, and data access runs here.
// Client calls via: supabase.functions.invoke('auth-login-signup', { body: payload })

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginPayload {
  action: 'login'
  email: string
  password: string
  rememberMe?: boolean
}

interface SignupPayload {
  action: 'signup'
  email: string
  password: string
  name: string
  company?: string
  role?: string
}

type AuthPayload = LoginPayload | SignupPayload

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: AuthPayload = await req.json()
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (payload.action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      })
      if (error) throw error
      return new Response(
        JSON.stringify({ user: data.user, session: data.session }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if (payload.action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            full_name: payload.name,
            company: payload.company,
            role: payload.role,
          },
        },
      })
      if (error) throw error
      return new Response(
        JSON.stringify({ user: data.user, session: data.session }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
