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
  searchQuery?: string
  className?: string
}

const statusVariant = {
  success: 'success' as const,
  failed: 'destructive' as const,
  running: 'default' as const,
  pending: 'secondary' as const,
}

function filterCronjobs(cronjobs: ActiveCronjob[], query: string): ActiveCronjob[] {
  if (!query.trim()) return cronjobs
  const q = query.toLowerCase()
  return cronjobs.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.target.toLowerCase().includes(q) ||
      c.schedule.toLowerCase().includes(q)
  )
}

export function ActiveCronjobsTable({
  cronjobs = [],
  isLoading,
  onToggle,
  searchQuery = '',
  className,
}: ActiveCronjobsTableProps) {
  const filteredCronjobs = filterCronjobs(cronjobs, searchQuery)
  if (isLoading) {
    return (
      <SkeletonTable
        className={className}
        columns={6}
        rows={3}
      />
    )
  }

  if (filteredCronjobs.length === 0) {
    const hasCronjobs = cronjobs.length > 0
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
            heading={hasCronjobs ? 'No matches found' : 'No cronjobs yet'}
            description={
              hasCronjobs
                ? 'Try a different search term to find cronjobs.'
                : 'Create your first cronjob to automate workflows. Schedule agents and workflows to run on a recurring basis.'
            }
            actionLabel={hasCronjobs ? undefined : 'Create Cronjob'}
            actionHref={hasCronjobs ? undefined : '/dashboard/cronjobs-dashboard'}
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
        {/* Mobile: card list */}
        <div className="space-y-3 md:hidden">
          {filteredCronjobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:bg-secondary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{job.name}</p>
                  <p className="text-xs text-muted-foreground">{job.target}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{job.schedule}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">Next: {job.nextRun}</span>
                    <Badge variant={statusVariant[job.lastOutcome]}>{job.lastOutcome}</Badge>
                  </div>
                </div>
                <Switch
                  checked={job.enabled}
                  onCheckedChange={(checked) => onToggle?.(job.id, checked)}
                  aria-label={`Toggle ${job.name}`}
                />
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
              {filteredCronjobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-border/50 transition-all duration-200 hover:bg-secondary/30 hover:shadow-sm"
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
