import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface SkeletonListProps {
  items?: number
  showHeader?: boolean
  variant?: 'compact' | 'default' | 'timeline'
  className?: string
}

/**
 * Reusable list skeleton for loading states.
 * Use for approval panels, activity feeds, etc.
 */
export function SkeletonList({
  items = 4,
  showHeader = true,
  variant = 'default',
  className,
}: SkeletonListProps) {
  const isTimeline = variant === 'timeline'
  const isCompact = variant === 'compact'

  return (
    <Card className={cn('animate-fade-in', className)}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-1 h-4 w-32" />
        </CardHeader>
      )}
      <CardContent>
        <div className={cn('space-y-4', isCompact && 'space-y-3')}>
          {Array.from({ length: items }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-3',
                isTimeline && 'relative'
              )}
            >
              {isTimeline && (
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              )}
              <div className={cn('flex-1 space-y-1', isCompact && 'space-y-0.5')}>
                <Skeleton className={cn('h-4', isCompact ? 'w-3/4' : 'w-full')} />
                <Skeleton className={cn('h-3', isCompact ? 'w-1/2' : 'w-24')} />
                {!isCompact && !isTimeline && (
                  <div className="mt-3 flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
