import { CheckCircle2 } from 'lucide-react'
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
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/20"
        aria-hidden
      >
        <CheckCircle2 className="h-6 w-6 text-accent-green" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">{message}</p>
      {children && <div className="mt-4 w-full max-w-sm">{children}</div>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg bg-accent-green/20 px-4 py-2 text-sm font-medium text-accent-green transition-all duration-200 hover:scale-[1.02] hover:bg-accent-green/30 active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
