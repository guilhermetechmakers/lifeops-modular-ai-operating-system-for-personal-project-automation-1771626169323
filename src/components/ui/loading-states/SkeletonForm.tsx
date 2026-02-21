import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface SkeletonFormProps {
  /** Number of form field rows */
  fields?: number
  /** Show form header (title + description) */
  showHeader?: boolean
  /** Show submit/cancel buttons area */
  showActions?: boolean
  className?: string
}

/**
 * Reusable form skeleton for loading states.
 * Use for form pages (settings, create/edit flows, etc.).
 * Per Design Reference: skeleton screens matching content layout.
 */
export function SkeletonForm({
  fields = 4,
  showHeader = true,
  showActions = true,
  className,
}: SkeletonFormProps) {
  return (
    <Card className={cn('animate-fade-in', className)}>
      {showHeader && (
        <CardHeader className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        {showActions && (
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
