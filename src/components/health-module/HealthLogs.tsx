import { ClipboardList, Plus, Smartphone, PenLine } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/loading-states/EmptyState'
import { SkeletonCard } from '@/components/ui/loading-states/SkeletonCard'
import { ErrorState } from '@/components/ui/loading-states/ErrorState'
import { cn } from '@/lib/utils'
import type { HealthLog } from '@/types/health'

const MOCK_LOGS: HealthLog[] = [
  {
    id: '1',
    type: 'device',
    category: 'Steps',
    value: 8420,
    unit: 'steps',
    loggedAt: new Date().toISOString(),
    source: 'Apple Watch',
  },
  {
    id: '2',
    type: 'manual',
    category: 'Water',
    value: 8,
    unit: 'glasses',
    loggedAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'device',
    category: 'Heart rate',
    value: 72,
    unit: 'bpm',
    loggedAt: new Date(Date.now() - 3600000).toISOString(),
    source: 'Fitbit',
  },
  {
    id: '4',
    type: 'manual',
    category: 'Mood',
    value: 'Good',
    loggedAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

interface HealthLogsProps {
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

export function HealthLogs({
  isLoading = false,
  hasError = false,
  onRetry,
}: HealthLogsProps) {
  if (hasError) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <ErrorState
            title="Failed to load logs"
            message="We couldn't load your health logs."
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <SkeletonCard rows={4} showHeader />
  }

  if (MOCK_LOGS.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <EmptyState
            icon={ClipboardList}
            heading="No logs yet"
            description="Log health data manually or connect devices to sync automatically."
            actionLabel="Add first log"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="border-b border-border bg-gradient-to-br from-accent/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <ClipboardList className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">Health Logs</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manual entries and synced device data
              </p>
            </div>
          </div>
          <Button size="sm" className="transition-all duration-200 hover:scale-[1.02]">
            <Plus className="mr-2 h-4 w-4" />
            Add log
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {MOCK_LOGS.map((log) => (
            <div
              key={log.id}
              className={cn(
                'flex items-center justify-between gap-4 px-6 py-4',
                'transition-all duration-200 hover:bg-secondary/30'
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    log.type === 'device' ? 'bg-accent-blue/10' : 'bg-secondary'
                  )}
                >
                  {log.type === 'device' ? (
                    <Smartphone className="h-5 w-5 text-accent-blue" />
                  ) : (
                    <PenLine className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{log.category}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-lg font-semibold text-accent">
                      {typeof log.value === 'number' ? log.value.toLocaleString() : log.value}
                    </span>
                    {log.unit && (
                      <span className="text-sm text-muted-foreground">{log.unit}</span>
                    )}
                    {log.source && (
                      <Badge variant="outline" className="text-xs">
                        {log.source}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(log.loggedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge variant={log.type === 'device' ? 'secondary' : 'outline'}>
                {log.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
