import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { EmptyState, SkeletonTable } from '@/components/ui/loading-states'
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
      <SkeletonTable
        className={className}
        columns={6}
        rows={3}
      />
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
            <Button variant="ghost" size="sm" className="transition-all hover:scale-[1.02]">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Clock}
            heading="No cronjobs yet"
            description="Create your first cronjob to automate workflows. Schedule agents and workflows to run on a recurring basis."
            actionLabel="Create Cronjob"
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
