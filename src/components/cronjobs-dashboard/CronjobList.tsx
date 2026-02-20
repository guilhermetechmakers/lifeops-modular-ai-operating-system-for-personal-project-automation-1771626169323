import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Cronjob } from '@/types/cronjobs'
import { cn } from '@/lib/utils'

type SortKey = 'name' | 'schedule' | 'timezone' | 'target' | 'automation_level' | 'status'
type SortDir = 'asc' | 'desc'

interface CronjobListProps {
  cronjobs: Cronjob[]
  isLoading?: boolean
  onSelect?: (cronjob: Cronjob) => void
  selectedId?: string | null
}

const automationLabels: Record<string, string> = {
  full: 'Full',
  assisted: 'Assisted',
  manual: 'Manual',
}

export function CronjobList({
  cronjobs,
  isLoading,
  onSelect,
  selectedId,
}: CronjobListProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const filteredAndSorted = useMemo(() => {
    let list = cronjobs.filter(
      (j) =>
        !search ||
        j.name.toLowerCase().includes(search.toLowerCase()) ||
        j.target.toLowerCase().includes(search.toLowerCase())
    )
    list = [...list].sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [cronjobs, search, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ key }: { key: SortKey }) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
    return sortDir === 'asc' ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5" />
    )
  }

  const Th = ({
    label,
    sortKey: sk,
    className,
  }: {
    label: string
    sortKey: SortKey
    className?: string
  }) => (
    <th
      className={cn(
        'pb-3 text-left text-sm font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors',
        className
      )}
      onClick={() => toggleSort(sk)}
    >
      <span className="inline-flex items-center">
        {label}
        <SortIcon key={sk} />
      </span>
    </th>
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
          <Skeleton className="h-10 w-64 mt-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Cronjob List</CardTitle>
            <CardDescription>Sortable table with name, schedule, timezone, target, automation level, state</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border">
                <Th label="Name" sortKey="name" />
                <Th label="Schedule" sortKey="schedule" />
                <Th label="Timezone" sortKey="timezone" />
                <Th label="Target" sortKey="target" />
                <Th label="Automation" sortKey="automation_level" />
                <Th label="State" sortKey="status" />
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <p className="text-muted-foreground">No cronjobs found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create your first cronjob to get started
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((job) => (
                  <tr
                    key={job.id}
                    className={cn(
                      'border-b border-border/50 transition-all duration-200 hover:bg-secondary/30 cursor-pointer',
                      selectedId === job.id && 'bg-accent/10'
                    )}
                    onClick={() => onSelect?.(job)}
                  >
                    <td className="py-4">
                      <p className="font-medium text-foreground">{job.name}</p>
                    </td>
                    <td className="py-4">
                      <code className="rounded bg-secondary px-2 py-1 text-xs text-muted-foreground">
                        {job.schedule}
                      </code>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{job.timezone}</td>
                    <td className="py-4 text-sm text-muted-foreground">{job.target}</td>
                    <td className="py-4">
                      <Badge variant="secondary">{automationLabels[job.automation_level] ?? job.automation_level}</Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant={job.status === 'active' ? 'success' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
