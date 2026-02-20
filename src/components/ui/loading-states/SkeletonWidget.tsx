import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface SkeletonWidgetProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * Reusable widget skeleton for overview/metric cards.
 * Use for Live Agents, Cronjobs, Approvals, Spend, etc.
 */
export function SkeletonWidget({ className, style }: SkeletonWidgetProps) {
  return (
    <Card className={cn('animate-fade-in', className)} style={style}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-8 w-16" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  )
}
