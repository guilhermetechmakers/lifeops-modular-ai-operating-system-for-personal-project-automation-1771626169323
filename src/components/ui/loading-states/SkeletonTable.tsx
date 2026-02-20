import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface SkeletonTableProps {
  columns?: number
  rows?: number
  showHeader?: boolean
  className?: string
}

/**
 * Reusable table skeleton for loading states.
 * Use for data tables, cronjobs, runs, etc.
 */
export function SkeletonTable({
  columns = 5,
  rows = 4,
  showHeader = true,
  className,
}: SkeletonTableProps) {
  return (
    <Card className={cn('animate-fade-in', className)}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {Array.from({ length: columns }, (_, i: number) => (
                  <th key={i} className="pb-3 pr-4 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-b border-border/50">
                  {Array.from({ length: columns }).map((_, colIdx) => (
                    <td key={colIdx} className="py-3 pr-4">
                      <Skeleton
                        className={cn(
                          'h-4',
                          colIdx === 0 ? 'w-24' : colIdx === columns - 1 ? 'w-12' : 'w-20'
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
