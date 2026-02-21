import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MoreHorizontal, Play, Pause, Copy, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, ErrorState } from '@/components/ui/loading-states'

interface CronjobItem {
  id: string
  name: string
  schedule: string
  status: string
  lastRun: string
}

const mockCronjobs: CronjobItem[] = [
  { id: '1', name: 'Daily Content Sync', schedule: '0 9 * * *', status: 'active', lastRun: '2h ago' },
  { id: '2', name: 'Finance Report', schedule: '0 0 * * 0', status: 'active', lastRun: '3d ago' },
  { id: '3', name: 'PR Summary', schedule: '*/30 * * * *', status: 'paused', lastRun: '1h ago' },
  { id: '4', name: 'Health Check-in', schedule: '0 8 * * 1-5', status: 'active', lastRun: '5h ago' },
]

export interface CronjobsDashboardProps {
  cronjobs?: CronjobItem[]
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

export function CronjobsDashboard({
  cronjobs = mockCronjobs,
  isLoading = false,
  hasError = false,
  onRetry,
}: CronjobsDashboardProps) {
  const [search, setSearch] = useState('')

  const filteredCronjobs = useMemo(() => {
    if (!search.trim()) return cronjobs
    const q = search.toLowerCase()
    return cronjobs.filter(
      (j) =>
        j.name.toLowerCase().includes(q) ||
        j.schedule.toLowerCase().includes(q) ||
        j.status.toLowerCase().includes(q)
    )
  }, [cronjobs, search])

  const showEmptyState = filteredCronjobs.length === 0 && !isLoading && !hasError
  const hasCronjobs = cronjobs.length > 0

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Cronjobs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage scheduled jobs and workflows
          </p>
        </div>
        <Button
          asChild
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
        >
          <Link to="/dashboard/cronjobs-dashboard?create=1">
            <Plus className="mr-2 h-4 w-4" />
            Create Cronjob
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Cronjob List</CardTitle>
              <CardDescription>Sortable list with run history</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Search cronjobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search cronjobs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="overflow-x-auto">
              <table className="w-full" aria-label="Loading cronjobs">
                <thead>
                  <tr className="border-b border-border">
                    {['Name', 'Schedule', 'Status', 'Last Run', 'Actions'].map((label) => (
                      <th key={label} className="pb-3 pr-4 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((rowIdx) => (
                    <tr key={rowIdx} className="border-b border-border/50">
                      <td className="py-4 pr-4">
                        <Skeleton className="h-4 w-32" style={{ animationDelay: `${rowIdx * 50}ms` }} />
                      </td>
                      <td className="py-4 pr-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="py-4 pr-4">
                        <Skeleton className="h-5 w-14 rounded-md" />
                      </td>
                      <td className="py-4 pr-4">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="py-4 text-right">
                        <Skeleton className="ml-auto h-8 w-24" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : hasError ? (
            <ErrorState
              title="Failed to load cronjobs"
              message="We couldn't load your cronjobs. Please check your connection and try again."
              onRetry={onRetry}
              retryLabel="Retry"
            />
          ) : showEmptyState ? (
            <EmptyState
              icon={Clock}
              heading={hasCronjobs ? 'No matches found' : 'No cronjobs yet'}
              description={
                hasCronjobs
                  ? 'Try adjusting your search to find what you\'re looking for.'
                  : 'Create your first cronjob to schedule automated workflows and tasks. Schedule agents and workflows to run on a recurring basis.'
              }
              actionLabel={hasCronjobs ? undefined : 'Create Cronjob'}
              actionHref={hasCronjobs ? undefined : '/dashboard/cronjobs-dashboard?create=1'}
            />
          ) : (
            <>
              {/* Mobile: card layout */}
              <div className="space-y-3 md:hidden">
                {filteredCronjobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-border p-4 transition-all duration-200 hover:border-border/80 hover:bg-secondary/30 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-foreground">{job.name}</p>
                      <Badge variant={job.status === 'active' ? 'success' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <code className="rounded bg-secondary px-2 py-0.5 text-xs">{job.schedule}</code>
                      <span>{job.lastRun}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" title="Run now" aria-label="Run now">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Pause" aria-label="Pause">
                        <Pause className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Clone" aria-label="Clone">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label="More actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full" aria-label="Cronjobs list">
                  <thead className="sticky top-0 z-10 bg-card">
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                        Schedule
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                        Last Run
                      </th>
                      <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCronjobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b border-border/50 transition-all duration-200 hover:bg-secondary/30 hover:shadow-sm"
                      >
                        <td className="py-4">
                          <p className="font-medium text-foreground">{job.name}</p>
                        </td>
                        <td className="py-4">
                          <code className="rounded bg-secondary px-2 py-1 text-xs text-muted-foreground">
                            {job.schedule}
                          </code>
                        </td>
                        <td className="py-4">
                          <Badge variant={job.status === 'active' ? 'success' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {job.lastRun}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon-sm" title="Run now" aria-label="Run now">
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" title="Pause" aria-label="Pause">
                              <Pause className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" title="Clone" aria-label="Clone">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label="More actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
