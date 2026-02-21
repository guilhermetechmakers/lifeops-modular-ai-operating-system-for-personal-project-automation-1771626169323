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
  /** Optional icon for the CTA button (e.g. Plus for "Create") */
  actionIcon?: LucideIcon
  /** Optional secondary content (e.g. examples, suggestions) */
  children?: React.ReactNode
  className?: string
  iconClassName?: string
}

/**
 * Reusable empty state with icon, heading, description, and optional CTA.
 * Use across Dashboard, Cronjobs, Runs, Projects, Content, Admin, etc.
 * Per Design Reference: icon + heading + description + CTA, helpful copy.
 */
export function EmptyState({
  icon: Icon,
  heading,
  description,
  actionLabel,
  actionHref,
  onAction,
  actionIcon: ActionIcon,
  children,
  className,
  iconClassName,
}: EmptyStateProps) {
  const hasAction = actionLabel && (actionHref || onAction)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-6',
        'transition-all duration-300 hover:border-border/80 hover:shadow-sm',
        className
      )}
    >
      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full bg-secondary transition-all duration-300',
          iconClassName
        )}
      >
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{heading}</h3>
      <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {children && <div className="mt-4 w-full max-w-sm">{children}</div>}
      {hasAction && (
        <div className="mt-6">
          {actionHref ? (
            <Button
              asChild
              className="transition-all duration-200 hover:scale-[1.03] hover:shadow-md active:scale-[0.98]"
              aria-label={actionLabel}
            >
              <Link to={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button
              onClick={onAction}
              className="transition-all duration-200 hover:scale-[1.03] hover:shadow-md active:scale-[0.98]"
            >
              {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" aria-hidden />}
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
