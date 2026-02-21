import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface SkeletonChartProps {
  /** Chart type affects layout: bar, line, pie, area */
  variant?: 'bar' | 'line' | 'area' | 'pie'
  /** Show chart header with title */
  showHeader?: boolean
  /** Show legend area */
  showLegend?: boolean
  /** Chart height in pixels */
  height?: number
  className?: string
}

/**
 * Reusable chart skeleton for loading states.
 * Use for dashboard charts, analytics, Recharts visualizations.
 * Per Design Reference: loading states while fetching data.
 */
export function SkeletonChart({
  variant = 'area',
  showHeader = true,
  showLegend = true,
  height = 200,
  className,
}: SkeletonChartProps) {
  const isPie = variant === 'pie'

  return (
    <Card className={cn('animate-fade-in overflow-hidden', className)}>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </CardHeader>
      )}
      <CardContent>
        <div
          className="flex w-full items-end gap-1"
          style={{ height: isPie ? 180 : height }}
          aria-hidden
        >
          {isPie ? (
            <div className="flex h-full w-full items-center justify-center">
              <Skeleton className="h-36 w-36 rounded-full" />
            </div>
          ) : (
            Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1 min-w-[4px]"
                style={{
                  height: `${30 + (i % 5) * 12}%`,
                  minHeight: '24px',
                }}
              />
            ))
          )}
        </div>
        {showLegend && (
          <div className="mt-4 flex flex-wrap gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
