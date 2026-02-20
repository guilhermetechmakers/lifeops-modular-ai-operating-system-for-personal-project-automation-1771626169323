import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User } from 'lucide-react'
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
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          role="alert"
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
              className={cn('pl-10', errors.name && 'border-red-500/50')}
              {...register('name')}
            />
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={cn('pl-10', errors.email && 'border-red-500/50')}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      {isSignup && (
        <>
          <div className="space-y-2">
            <Label htmlFor="company">Company (optional)</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              className={cn(errors.company && 'border-red-500/50')}
              {...register('company')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role (optional)</Label>
            <Input
              id="role"
              placeholder="Developer, Manager, etc."
              className={cn(errors.role && 'border-red-500/50')}
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
            >
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className={cn('pl-10', errors.password && 'border-red-500/50')}
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
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
      >
        {isLoading
          ? isSignup
            ? 'Creating account...'
            : 'Signing in...'
          : isSignup
            ? 'Create account'
            : 'Sign in'}
      </Button>
    </form>
  )
}
