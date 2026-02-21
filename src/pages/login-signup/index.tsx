import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthForm } from '@/components/login-signup/AuthForm'
import { SSOButtons } from '@/components/login-signup/SSOButtons'
import { SignupToggle } from '@/components/login-signup/SignupToggle'
import { DemoExploreButton } from '@/components/login-signup/DemoExploreButton'
import { LegalLinks } from '@/components/login-signup/LegalLinks'
import { FooterLinks } from '@/components/login-signup/FooterLinks'
import type { AuthFormData } from '@/components/login-signup/AuthForm'
import { toast } from 'sonner'

export function LoginSignupPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Sign in / Sign up — LifeOps'
    return () => {
      document.title = 'LifeOps — AI Operating System for Life & Projects'
    }
  }, [])

  async function handleSubmit(_data: AuthFormData) {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: When Supabase is configured, call supabase.functions.invoke('auth-login-signup', { body: data })
      await new Promise((r) => setTimeout(r, 800))
      if (mode === 'signup') {
        toast.success('Account created. Please verify your email.')
      } else {
        toast.success('Signed in successfully')
      }
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSSO(provider: string) {
    toast.info(`${provider} SSO coming soon`)
  }

  function handleEnterprise() {
    toast.info('Enterprise SSO coming soon')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 relative">
      {/* Loading overlay during form submission */}
      {isLoading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 shadow-card">
            <Loader2 className="h-10 w-10 animate-spin text-accent" aria-hidden />
            <p className="text-sm font-medium text-foreground">
              {mode === 'signup' ? 'Creating your account...' : 'Signing you in...'}
            </p>
          </div>
        </div>
      )}

      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-purple/5 animate-gradient-shift bg-[length:200%_200%]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background/95 to-background" />
      </div>

      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          aria-label="LifeOps - Return to home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent shadow-accent-glow">
            <Zap className="h-6 w-6 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">LifeOps</span>
        </Link>

        <Card className="animate-fade-in-up border-border/80 shadow-card transition-all duration-300 hover:shadow-card-hover">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">
              {mode === 'signup' ? 'Create an account' : 'Sign in'}
            </CardTitle>
            <CardDescription>
              {mode === 'signup'
                ? 'Enter your details to get started'
                : 'Enter your credentials to access your account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AuthForm
              mode={mode}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />

            <SSOButtons
              onSSO={handleSSO}
              onEnterprise={handleEnterprise}
              disabled={isLoading}
            />

            <DemoExploreButton disabled={isLoading} />

            <SignupToggle mode={mode} onToggle={() => setMode(mode === 'login' ? 'signup' : 'login')} />
          </CardContent>
        </Card>

        <div className="mt-8 space-y-6">
          <LegalLinks />
          <FooterLinks />
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link
            to="/"
            className="hover:text-foreground transition-colors"
            aria-label="Back to home page"
          >
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginSignupPage
