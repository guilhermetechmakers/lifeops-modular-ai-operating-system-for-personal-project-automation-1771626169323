import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SuccessStateProps {
  title?: string
  message?: string
  className?: string
}

/**
 * Reusable success confirmation state.
 * Use for inline success feedback (e.g., after form submission, approval).
 * For toast notifications, use Sonner.
 */
export function SuccessState({
  title = 'Success',
  message = 'Your action was completed successfully.',
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-accent-green/30 bg-accent-green/10 py-8 px-6',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/20">
        <CheckCircle2 className="h-6 w-6 text-accent-green" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
