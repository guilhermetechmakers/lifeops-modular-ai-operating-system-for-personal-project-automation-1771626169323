import { Bot, Clock, CheckSquare, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonWidget } from '@/components/ui/loading-states'
import { cn } from '@/lib/utils'
import type { DashboardOverview } from '@/types/master-dashboard'

export interface OverviewWidgetsProps {
  data?: DashboardOverview | null
  isLoading?: boolean
  className?: string
}

function generateSparklineData(value: number, points = 7): { v: number }[] {
  const base = Math.max(0, value - 2)
  return Array.from({ length: points }, (_, i) => ({
    v: base + Math.sin((i / (points - 1)) * Math.PI) * (value * 0.3) + (value - base) * (i / (points - 1)),
  }))
}

const widgets = [
  {
    key: 'liveAgentsCount' as const,
    label: 'Live Agents',
    icon: Bot,
    gradient: 'from-accent/20 to-accent/5',
    iconBg: 'bg-accent/20',
    iconColor: 'text-accent',
    format: (v: number) => String(v),
    change: '+2',
  },
  {
    key: 'cronjobsNextRuns' as const,
    label: 'Cronjobs Next Runs',
    icon: Clock,
    gradient: 'from-accent-blue/20 to-accent-blue/5',
    iconBg: 'bg-accent-blue/20',
    iconColor: 'text-accent-blue',
    format: (v: number) => String(v),
    change: '+1',
  },
  {
    key: 'pendingApprovals' as const,
    label: 'Pending Approvals',
    icon: CheckSquare,
    gradient: 'from-amber-500/20 to-amber-500/5',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    format: (v: number) => String(v),
    change: '3',
  },
  {
    key: 'monthlySpend' as const,
    label: 'Monthly Spend',
    icon: DollarSign,
    gradient: 'from-accent-green/20 to-accent-green/5',
    iconBg: 'bg-accent-green/20',
    iconColor: 'text-accent-green',
    format: (v: number) => `$${v}`,
    change: '-12%',
  },
]

export function OverviewWidgets({ data, isLoading, className }: OverviewWidgetsProps) {
  if (isLoading) {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {widgets.map((w, i) => (
          <SkeletonWidget
            key={w.key}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {widgets.map((w, i) => {
        const value = data?.[w.key] ?? 0
        const sparkData = generateSparklineData(typeof value === 'number' ? value : 0)
        const isPositive = w.change.startsWith('+')
        const isNegative = w.change.startsWith('-')
        const sparkId = `spark-${i}`
        return (
          <Card
            key={w.key}
            className={cn(
              'animate-fade-in overflow-hidden transition-all duration-300',
              'hover:-translate-y-0.5 hover:shadow-card-hover hover:border-accent/20',
              `bg-gradient-to-br ${w.gradient} border-border`
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {w.label}
              </CardTitle>
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                  w.iconBg,
                  w.iconColor
                )}
              >
                <w.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{w.format(value)}</div>
              <div className="mt-2 flex h-10 w-full items-end">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="rgb(var(--accent))"
                      strokeWidth={1.5}
                      fill={`url(#${sparkId})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                {isPositive && <TrendingUp className="h-3.5 w-3.5 shrink-0 text-accent" />}
                {isNegative && <TrendingDown className="h-3.5 w-3.5 shrink-0 text-accent-green" />}
                <span className={isPositive ? 'text-accent' : isNegative ? 'text-accent-green' : ''}>
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
