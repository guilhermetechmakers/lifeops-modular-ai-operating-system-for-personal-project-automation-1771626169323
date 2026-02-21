import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SuccessStateProps {
  title?: string
  message?: string
  /** Optional action (e.g. "View details", "Continue") */
  actionLabel?: string
  onAction?: () => void
  /** Optional child content below message */
  children?: React.ReactNode
  className?: string
}

/**
 * Reusable success confirmation state.
 * Use for inline success feedback (e.g., after form submission, approval).
 * For toast notifications, use Sonner.
 * Per Design Reference: success state with checkmark animation.
 */
export function SuccessState({
  title = 'Success',
  message = 'Your action was completed successfully.',
  actionLabel,
  onAction,
  children,
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-accent-green/30 bg-accent-green/10 py-8 px-6',
        'transition-all duration-300',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/20 animate-checkmark-scale"
        aria-hidden
      >
        <CheckCircle2 className="h-6 w-6 text-accent-green" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">{message}</p>
      {children && <div className="mt-4 w-full max-w-sm">{children}</div>}
      {actionLabel && onAction && (
        <Button
          type="button"
          variant="secondary"
          onClick={onAction}
          className="mt-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-accent-green/20 text-accent-green hover:bg-accent-green/30 border-0"
          aria-label={actionLabel}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
