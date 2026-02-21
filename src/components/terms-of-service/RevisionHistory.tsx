import { History } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { TermsRevision } from '@/types/terms-of-service'

export interface RevisionHistoryProps {
  revisions: TermsRevision[]
  isLoading?: boolean
  className?: string
}

const FALLBACK_REVISIONS: TermsRevision[] = [
  { version: '1.0.0', date: '2025-02-20', summary: 'Initial terms of service' },
]

/**
 * Revision History component.
 * Displays version history of the Terms of Service.
 */
export function RevisionHistory({
  revisions,
  isLoading = false,
  className,
}: RevisionHistoryProps) {
  const items = revisions.length > 0 ? revisions : FALLBACK_REVISIONS

  return (
    <Card className={cn('animate-fade-in-up [animation-delay:0.1s] [animation-fill-mode:both]', className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Revision History
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Version history of the Terms of Service document.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <Skeleton className="h-6 w-16" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((rev, idx) => (
              <div
                key={rev.version}
                className={cn(
                  'flex flex-col gap-1 rounded-lg border border-border p-4',
                  'transition-all duration-200 hover:border-accent/30 hover:bg-secondary/30',
                  idx === 0 && 'border-accent/20 bg-accent/5'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-foreground">
                    v{rev.version}
                  </span>
                  <span className="text-xs text-muted-foreground">{rev.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{rev.summary}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
