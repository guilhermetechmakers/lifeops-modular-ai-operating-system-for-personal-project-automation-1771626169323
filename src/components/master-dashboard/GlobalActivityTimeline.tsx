import { MessageSquare, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState, SkeletonList } from '@/components/ui/loading-states'
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
      <SkeletonList
        className={className}
        items={4}
        variant="timeline"
      />
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
          <EmptyState
            icon={MessageSquare}
            heading="No activity yet"
            description="Agent messages, handoffs, and alerts will appear here as your agents communicate and collaborate."
          />
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
