import { cn } from '@/lib/utils'

export interface SignupToggleProps {
  mode: 'login' | 'signup'
  onToggle: () => void
  className?: string
}

export function SignupToggle({ mode, onToggle, className }: SignupToggleProps) {
  const isSignup = mode === 'signup'

  return (
    <p
      className={cn(
        'text-center text-sm text-muted-foreground',
        className
      )}
    >
      {isSignup ? (
        <>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="font-medium text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Sign in
          </button>
        </>
      ) : (
        <>
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="font-medium text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Sign up
          </button>
        </>
      )}
    </p>
  )
}
