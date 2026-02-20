import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import type { ActiveCronjob } from '@/types/master-dashboard'

export interface ActiveCronjobsTableProps {
  cronjobs?: ActiveCronjob[]
  isLoading?: boolean
  onToggle?: (id: string, enabled: boolean) => void
  className?: string
}

const statusVariant = {
  success: 'success' as const,
  failed: 'destructive' as const,
  running: 'default' as const,
  pending: 'secondary' as const,
}

export function ActiveCronjobsTable({
  cronjobs = [],
  isLoading,
  onToggle,
  className,
}: ActiveCronjobsTableProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (cronjobs.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Cronjobs</CardTitle>
            <CardDescription>Name, target, schedule, next run, last outcome</CardDescription>
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
              <ArrowUpRight className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No cronjobs yet</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Create your first cronjob to automate workflows
            </p>
            <Link to="/dashboard/cronjobs-dashboard">
              <Button className="mt-4">Create Cronjob</Button>
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
          <CardTitle>Active Cronjobs</CardTitle>
          <CardDescription>Name, target, schedule, next run, last outcome</CardDescription>
        </div>
        <Link to="/dashboard/cronjobs-dashboard">
          <Button variant="ghost" size="sm" className="transition-all hover:scale-[1.02]">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Target
                </th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Schedule
                </th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Next Run
                </th>
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  Last Outcome
                </th>
                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                  Enable
                </th>
              </tr>
            </thead>
            <tbody>
              {cronjobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                >
                  <td className="py-3 text-sm font-medium text-foreground">{job.name}</td>
                  <td className="py-3 text-sm text-muted-foreground">{job.target}</td>
                  <td className="py-3 text-sm text-muted-foreground font-mono">{job.schedule}</td>
                  <td className="py-3 text-sm text-muted-foreground">{job.nextRun}</td>
                  <td className="py-3">
                    <Badge variant={statusVariant[job.lastOutcome]}>{job.lastOutcome}</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Switch
                      checked={job.enabled}
                      onCheckedChange={(checked) => onToggle?.(job.id, checked)}
                      aria-label={`Toggle ${job.name}`}
                    />
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
