import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Clock, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Cronjob } from '@/types/cronjobs'
import { cn } from '@/lib/utils'

type SortKey = 'name' | 'schedule' | 'timezone' | 'target' | 'automation_level' | 'status'
type SortDir = 'asc' | 'desc'

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50]
const DEFAULT_ITEMS_PER_PAGE = 10

interface CronjobListProps {
  cronjobs: Cronjob[]
  isLoading?: boolean
  onSelect?: (cronjob: Cronjob) => void
  selectedId?: string | null
  onCreateClick?: () => void
}

const automationLabels: Record<string, string> = {
  full: 'Full',
  assisted: 'Assisted',
  manual: 'Manual',
  suggest_only: 'Suggest Only',
  approval_required: 'Approval Required',
  conditional_auto_execute: 'Conditional',
  bounded_autopilot: 'Bounded Autopilot',
}

export function CronjobList({
  cronjobs,
  isLoading,
  onSelect,
  selectedId,
  onCreateClick,
}: CronjobListProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE)

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

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1
  const paginatedList = filteredAndSorted.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  )

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  const handleItemsPerPageChange = (value: string) => {
    const num = parseInt(value, 10)
    setItemsPerPage(num)
    setPage(0)
  }

  const SortIcon = ({ sortKey: sk }: { sortKey: SortKey }) => {
    if (sortKey !== sk) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
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
        <SortIcon sortKey={sk} />
      </span>
    </th>
  )

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-card-hover">
        <CardHeader>
          <Skeleton className="h-6 w-48 animate-pulse" />
          <Skeleton className="mt-2 h-4 w-64 animate-pulse" />
          <Skeleton className="mt-4 h-10 w-64 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Cronjob List</CardTitle>
            <CardDescription>
              Sortable table with name, schedule, timezone, target, automation level, state
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search cronjobs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              className="pl-9"
              aria-label="Search cronjobs"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAndSorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-secondary/50 p-4 mb-4">
              <Clock className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No cronjobs found</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {search
                ? 'Try adjusting your search to find what you\'re looking for.'
                : 'Create your first cronjob to schedule automated workflows and tasks.'}
            </p>
            {!search && onCreateClick && (
              <Button
                onClick={onCreateClick}
                className="mt-6 bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Cronjob
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile: card layout */}
            <div className="md:hidden space-y-3">
              {paginatedList.map((job) => (
                <div
                  key={job.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect?.(job)}
                  onKeyDown={(e) => e.key === 'Enter' && onSelect?.(job)}
                  className={cn(
                    'rounded-xl border border-border p-4 transition-all duration-200',
                    'hover:bg-secondary/30 hover:shadow-md active:scale-[0.99]',
                    selectedId === job.id && 'ring-2 ring-accent bg-accent/10'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-foreground">{job.name}</p>
                    <Badge variant={job.status === 'active' ? 'success' : 'secondary'}>
                      {job.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <code className="rounded bg-secondary px-2 py-0.5 text-xs">{job.schedule}</code>
                    <span>{job.timezone}</span>
                    <span>{job.target}</span>
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {automationLabels[job.automation_level] ?? job.automation_level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto -mx-1">
              <table className="w-full" aria-label="Cronjobs list">
                <thead className="sticky top-0 bg-card z-10 border-b border-border">
                  <tr>
                    <Th label="Name" sortKey="name" />
                    <Th label="Schedule" sortKey="schedule" />
                    <Th label="Timezone" sortKey="timezone" />
                    <Th label="Target" sortKey="target" />
                    <Th label="Automation" sortKey="automation_level" />
                    <Th label="State" sortKey="status" />
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.map((job) => (
                    <tr
                      key={job.id}
                      tabIndex={0}
                      className={cn(
                        'border-b border-border/50 transition-all duration-200 cursor-pointer',
                        'hover:bg-secondary/30 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset',
                        selectedId === job.id && 'bg-accent/10'
                      )}
                      onClick={() => onSelect?.(job)}
                      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(job)}
                      aria-selected={selectedId === job.id}
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
                        <Badge variant="secondary">
                          {automationLabels[job.automation_level] ?? job.automation_level}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Badge variant={job.status === 'active' ? 'success' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(totalPages > 1 || filteredAndSorted.length > DEFAULT_ITEMS_PER_PAGE) && (
              <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {page * itemsPerPage + 1}–{Math.min((page + 1) * itemsPerPage, filteredAndSorted.length)} of{' '}
                    {filteredAndSorted.length}
                  </p>
                  <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="h-8 w-[100px]" aria-label="Items per page">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} per page
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
