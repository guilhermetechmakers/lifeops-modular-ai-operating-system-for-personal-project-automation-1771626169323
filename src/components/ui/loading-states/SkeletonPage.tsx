import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonWidget } from './SkeletonWidget'
import { SkeletonTable } from './SkeletonTable'
import { SkeletonList } from './SkeletonList'
import { cn } from '@/lib/utils'

export interface SkeletonPageProps {
  /** Show header section (title + subtitle) */
  showHeader?: boolean
  /** Number of overview widgets (0–8) */
  widgetCount?: number
  /** Show main content row (table + side panel) */
  showMainRow?: boolean
  /** Show second content row (e.g. runs + activity) */
  showSecondRow?: boolean
  /** Table columns */
  tableColumns?: number
  /** Table rows */
  tableRows?: number
  /** Side panel skeleton variant for main row */
  sidePanelVariant?: 'default' | 'compact' | 'timeline'
  /** Side panel items count */
  sidePanelItems?: number
  className?: string
}

/**
 * Full-page skeleton for dashboard-style layouts.
 * Use for initial page load with stagger animations.
 * Matches Master Dashboard, Cronjobs, Runs, Projects, etc.
 */
export function SkeletonPage({
  showHeader = true,
  widgetCount = 4,
  showMainRow = true,
  showSecondRow = false,
  tableColumns = 5,
  tableRows = 4,
  sidePanelVariant = 'default',
  sidePanelItems = 4,
  className,
}: SkeletonPageProps) {
  return (
    <div className={cn('space-y-8', className)} role="status" aria-label="Loading">
      {showHeader && (
        <div className="animate-fade-in space-y-2">
          <Skeleton className="h-9 w-64 sm:h-10 sm:w-80" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      )}

      {widgetCount > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: Math.min(widgetCount, 8) }).map((_, i) => (
            <SkeletonWidget
              key={i}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      )}

      {showMainRow && (
        <div
          className="grid gap-6 lg:grid-cols-3 animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="lg:col-span-2">
            <SkeletonTable columns={tableColumns} rows={tableRows} showHeader />
          </div>
          <div>
            <SkeletonList items={sidePanelItems} variant={sidePanelVariant} showHeader />
          </div>
        </div>
      )}

      {showSecondRow && (
        <div
          className="grid gap-6 lg:grid-cols-3 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="lg:col-span-2">
            <SkeletonTable columns={4} rows={4} showHeader />
          </div>
          <div>
            <SkeletonList items={4} variant="timeline" showHeader />
          </div>
        </div>
      )}

      <span className="sr-only">Loading content...</span>
    </div>
  )
}
