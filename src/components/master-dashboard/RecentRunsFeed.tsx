import { Link } from 'react-router-dom'
import { ArrowUpRight, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
            <Button variant="ghost" size="sm">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No runs yet</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Cronjob runs will appear here when they execute
            </p>
            <Link to="/dashboard/cronjobs-dashboard">
              <Button variant="outline" className="mt-4">
                View Cronjobs
              </Button>
            </Link>
          </div>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
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
                  className="border-b border-border/50 transition-colors hover:bg-secondary/30"
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
                      >
                        View
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
