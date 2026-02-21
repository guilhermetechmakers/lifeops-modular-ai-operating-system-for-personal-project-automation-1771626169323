import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface SkeletonWidgetProps {
  /** Show chart/sparkline area (matches OverviewWidgets) */
  showChart?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Reusable widget skeleton for overview/metric cards.
 * Use for Live Agents, Cronjobs, Approvals, Spend, etc.
 * Matches dashboard metric cards with optional chart area.
 */
export function SkeletonWidget({
  showChart = true,
  className,
  style,
}: SkeletonWidgetProps) {
  return (
    <Card className={cn('animate-fade-in overflow-hidden', className)} style={style}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-8 w-16" />
        {showChart && (
          <div className="mt-2 flex h-10 w-full items-end gap-0.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1"
                style={{ height: `${30 + (i % 3) * 15}%` }}
              />
            ))}
          </div>
        )}
        <Skeleton className="mt-2 h-4 w-20" />
      </CardContent>
    </Card>
  )
}
