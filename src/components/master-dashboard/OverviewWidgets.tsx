import { Bot, Clock, CheckSquare, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { DashboardOverview } from '@/types/master-dashboard'

export interface OverviewWidgetsProps {
  data?: DashboardOverview | null
  isLoading?: boolean
  className?: string
}

const widgets = [
  {
    key: 'liveAgentsCount' as const,
    label: 'Live Agents',
    icon: Bot,
    color: 'text-accent',
    format: (v: number) => String(v),
    change: '+2',
  },
  {
    key: 'cronjobsNextRuns' as const,
    label: 'Cronjobs Next Runs',
    icon: Clock,
    color: 'text-accent-blue',
    format: (v: number) => String(v),
    change: '+1',
  },
  {
    key: 'pendingApprovals' as const,
    label: 'Pending Approvals',
    icon: CheckSquare,
    color: 'text-amber-400',
    format: (v: number) => String(v),
    change: '3',
  },
  {
    key: 'monthlySpend' as const,
    label: 'Monthly Spend',
    icon: DollarSign,
    color: 'text-accent-green',
    format: (v: number) => `$${v}`,
    change: '-12%',
  },
]

export function OverviewWidgets({ data, isLoading, className }: OverviewWidgetsProps) {
  if (isLoading) {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {widgets.map((w, i) => (
          <Card key={w.key} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <w.icon className={cn('h-4 w-4', w.color)} />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-8 w-16" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {widgets.map((w, i) => {
        const value = data?.[w.key] ?? 0
        return (
          <Card
            key={w.key}
            className="animate-fade-in transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {w.label}
              </CardTitle>
              <w.icon className={cn('h-4 w-4', w.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{w.format(value)}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    w.change.startsWith('-')
                      ? 'text-accent-green'
                      : 'text-accent'
                  }
                >
                  {w.change}
                </span>{' '}
                from last week
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
