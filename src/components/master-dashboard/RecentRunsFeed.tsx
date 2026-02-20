import { Link } from 'react-router-dom'
import { ArrowUpRight, PlayCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState, SkeletonTable } from '@/components/ui/loading-states'
import type { RecentRun } from '@/types/master-dashboard'

export interface RecentRunsFeedProps {
  runs?: RecentRun[]
  isLoading?: boolean
  className?: string
}

const statusVariant = {
  success: 'success' as const,
  failed: 'destructive' as const,
  running: 'default' as const,
  pending: 'secondary' as const,
}

export function RecentRunsFeed({ runs = [], isLoading, className }: RecentRunsFeedProps) {
  if (isLoading) {
    return (
      <SkeletonTable
        className={className}
        columns={4}
        rows={4}
      />
    )
  }

  if (runs.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Runs</CardTitle>
            <CardDescription>Chronological runs with status</CardDescription>
          </div>
          <Link to="/dashboard/cronjobs-dashboard">
            <Button variant="ghost" size="sm" className="transition-all hover:scale-[1.02]">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={PlayCircle}
            heading="No runs yet"
            description="Cronjob and workflow runs will appear here when they execute. Create a cronjob to get started."
            actionLabel="View Cronjobs"
            actionHref="/dashboard/cronjobs-dashboard"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Runs</CardTitle>
          <CardDescription>Chronological runs with status</CardDescription>
        </div>
        <Link to="/dashboard/cronjobs-dashboard">
          <Button variant="ghost" size="sm" className="transition-all hover:scale-[1.02]">
            View all
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {/* Mobile: card list */}
        <div className="space-y-3 md:hidden">
          {runs.map((run) => (
            <div
              key={run.id}
              className="rounded-lg border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:bg-secondary/30"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{run.name}</p>
                  <p className="text-xs text-muted-foreground">{run.time}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={statusVariant[run.status]}>{run.status}</Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      to={run.logsLink ?? `/dashboard/cronjobs-dashboard?run=${run.id}`}
                      className="transition-all hover:scale-[1.02]"
                    >
                      Logs
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop: table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-card">
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Job
                </th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Time
                </th>
                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                  Logs
                </th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr
                  key={run.id}
                  className="border-b border-border/50 transition-all duration-200 hover:bg-secondary/30 hover:shadow-sm"
                >
                  <td className="py-3 text-sm font-medium text-foreground">{run.name}</td>
                  <td className="py-3">
                    <Badge variant={statusVariant[run.status]}>{run.status}</Badge>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{run.time}</td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        to={run.logsLink ?? `/dashboard/cronjobs-dashboard?run=${run.id}`}
                        className="transition-all hover:scale-[1.02]"
                        aria-label={`View logs for ${run.name}`}
                      >
                        Logs
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
