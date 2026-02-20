import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface SkeletonCardProps {
  rows?: number
  showHeader?: boolean
  className?: string
}

/**
 * Reusable card skeleton for loading states.
 * Use for overview widgets, panels, etc.
 */
export function SkeletonCard({
  rows = 3,
  showHeader = true,
  className,
}: SkeletonCardProps) {
  return (
    <Card className={cn('animate-fade-in', className)}>
      {showHeader && (
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
