import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon: LucideIcon
  heading: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
  iconClassName?: string
}

/**
 * Reusable empty state with icon, heading, description, and optional CTA.
 * Use across Dashboard, Cronjobs, Runs, Projects, Content, Admin, etc.
 */
export function EmptyState({
  icon: Icon,
  heading,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
  iconClassName,
}: EmptyStateProps) {
  const hasAction = actionLabel && (actionHref || onAction)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-6',
        className
      )}
    >
      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full bg-secondary transition-all duration-300',
          iconClassName
        )}
      >
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{heading}</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">{description}</p>
      {hasAction && (
        <div className="mt-6">
          {actionHref ? (
            <Button asChild className="transition-all duration-200 hover:scale-[1.02]">
              <Link to={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button
              onClick={onAction}
              className="transition-all duration-200 hover:scale-[1.02]"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
