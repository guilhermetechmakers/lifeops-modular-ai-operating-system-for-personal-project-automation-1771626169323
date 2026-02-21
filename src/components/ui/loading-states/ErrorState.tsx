import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  retryAriaLabel?: string
  className?: string
}

/**
 * Reusable error state with retry button.
 * Use for network errors, failed fetches, etc.
 * Per Design Reference: error states with retry buttons.
 */
export function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load this content. Please try again.",
  onRetry,
  retryLabel = 'Retry',
  retryAriaLabel,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-warning/30 bg-warning/10 py-12 px-6',
        'transition-all duration-300',
        className
      )}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/20"
        aria-hidden
      >
        <AlertCircle className="h-7 w-7 text-warning" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="mt-6 transition-all duration-200 hover:scale-[1.03] hover:shadow-md active:scale-[0.98]"
          aria-label={retryAriaLabel ?? retryLabel}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
