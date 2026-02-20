import { useState } from 'react'
import { Plus, Search, MoreHorizontal, Play, Pause, Copy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const mockCronjobs = [
  { id: '1', name: 'Daily Content Sync', schedule: '0 9 * * *', status: 'active', lastRun: '2h ago' },
  { id: '2', name: 'Finance Report', schedule: '0 0 * * 0', status: 'active', lastRun: '3d ago' },
  { id: '3', name: 'PR Summary', schedule: '*/30 * * * *', status: 'paused', lastRun: '1h ago' },
  { id: '4', name: 'Health Check-in', schedule: '0 8 * * 1-5', status: 'active', lastRun: '5h ago' },
]

export function CronjobsDashboard() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Cronjobs
          </h1>
          <p className="text-muted-foreground">
            Manage scheduled jobs and workflows
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Cronjob
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Cronjob List</CardTitle>
              <CardDescription>Sortable list with run history</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search cronjobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
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
                {mockCronjobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-border/50 transition-colors hover:bg-secondary/30"
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
                        <Button variant="ghost" size="icon-sm" title="Run now">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title="Pause">
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title="Clone">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
