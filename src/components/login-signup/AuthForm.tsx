import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
  name: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
})

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  role: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

export type AuthFormData = LoginFormData | SignupFormData

type FormValues = {
  email: string
  password: string
  rememberMe?: boolean
  name?: string
  company?: string
  role?: string
}

export interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (data: AuthFormData) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export function AuthForm({ mode, onSubmit, isLoading = false, error }: AuthFormProps) {
  const isSignup = mode === 'signup'
  const schema = isSignup ? signupSchema : loginSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      name: '',
      company: '',
      role: '',
    },
  })

  const rememberMe = watch('rememberMe')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-4', error && 'animate-shake')}
    >
      {error && (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {isSignup && (
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <Input
              id="name"
              placeholder="John Doe"
              className={cn('pl-10', errors.name && 'border-destructive focus-visible:ring-destructive')}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
            />
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          </div>
          {errors.name && (
            <p id="name-error" className="text-sm text-destructive" role="alert">{errors.name.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={cn('pl-10', errors.email && 'border-destructive focus-visible:ring-destructive')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive" role="alert">{errors.email.message}</p>
        )}
      </div>

      {isSignup && (
        <>
          <div className="space-y-2">
            <Label htmlFor="company">Company (optional)</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              className={cn(errors.company && 'border-destructive focus-visible:ring-destructive')}
              aria-invalid={!!errors.company}
              aria-describedby={errors.company ? 'company-error' : undefined}
              {...register('company')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role (optional)</Label>
            <Input
              id="role"
              placeholder="Developer, Manager, etc."
              className={cn(errors.role && 'border-destructive focus-visible:ring-destructive')}
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? 'role-error' : undefined}
              {...register('role')}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {!isSignup && (
            <Link
              to="/password-reset"
              className="text-sm text-accent hover:underline"
              aria-label="Reset your password"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            className={cn('pl-10', errors.password && 'border-destructive focus-visible:ring-destructive')}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive" role="alert">{errors.password.message}</p>
        )}
        {isSignup && (
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters
          </p>
        )}
      </div>

      {!isSignup && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
            aria-label="Remember me on this device"
          />
          <Label
            htmlFor="rememberMe"
            className="cursor-pointer text-sm font-normal text-muted-foreground"
          >
            Remember me
          </Label>
        </div>
      )}

      <Button
        type="submit"
        className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        disabled={isLoading}
        aria-busy={isLoading}
        aria-label={isLoading ? (isSignup ? 'Creating account' : 'Signing in') : (isSignup ? 'Create account' : 'Sign in')}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {isSignup ? 'Creating account...' : 'Signing in...'}
          </>
        ) : isSignup ? (
          'Create account'
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}
