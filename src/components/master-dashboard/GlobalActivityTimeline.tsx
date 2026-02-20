import { MessageSquare, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ActivityEvent } from '@/types/master-dashboard'

export interface GlobalActivityTimelineProps {
  events?: ActivityEvent[]
  isLoading?: boolean
  className?: string
}

export function GlobalActivityTimeline({
  events = [],
  isLoading,
  className,
}: GlobalActivityTimelineProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-1 h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (events.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Global Activity</CardTitle>
          <CardDescription>Agent-to-agent messages and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No activity yet</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Agent messages and alerts will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Global Activity</CardTitle>
        <CardDescription>Agent-to-agent messages and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <div className="absolute left-4 top-8 bottom-8 w-px bg-border" />
          {events.map((event, i) => (
            <div
              key={event.id}
              className="relative flex gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-card',
                  event.type === 'alert'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-accent/20 text-accent'
                )}
              >
                {event.type === 'alert' ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-4">
                <p className="text-sm text-foreground">{event.message}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-muted-foreground">
                  {event.fromAgent && (
                    <span>
                      {event.fromAgent}
                      {event.toAgent && ` → ${event.toAgent}`}
                    </span>
                  )}
                  <span>·</span>
                  <span>{event.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
