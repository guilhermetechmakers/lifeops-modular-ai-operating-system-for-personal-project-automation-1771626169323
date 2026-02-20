import { Moon, Activity, Smartphone, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { SkeletonCard } from '@/components/ui/loading-states/SkeletonCard'
import { ErrorState } from '@/components/ui/loading-states/ErrorState'
import { cn } from '@/lib/utils'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const MOCK_SLEEP_DATA = [
  { day: 'Mon', hours: 7.2, score: 82 },
  { day: 'Tue', hours: 6.8, score: 78 },
  { day: 'Wed', hours: 7.5, score: 88 },
  { day: 'Thu', hours: 7.0, score: 85 },
  { day: 'Fri', hours: 6.5, score: 75 },
  { day: 'Sat', hours: 8.0, score: 92 },
  { day: 'Sun', hours: 7.3, score: 84 },
]

const MOCK_SUGGESTIONS = [
  'Avoid caffeine after 2 PM for better sleep quality',
  'Your sleep improved 12% this week — keep the routine',
]

interface RecoverySleepInsightsProps {
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

export function RecoverySleepInsights({
  isLoading = false,
  hasError = false,
  onRetry,
}: RecoverySleepInsightsProps) {
  if (hasError) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <ErrorState
            title="Failed to load insights"
            message="We couldn't load your recovery and sleep data."
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <SkeletonCard rows={4} showHeader />
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="border-b border-border bg-gradient-to-br from-accent-blue/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-blue/10">
              <Moon className="h-5 w-5 text-accent-blue" />
            </div>
            <div>
              <CardTitle className="text-lg">Recovery & Sleep</CardTitle>
              <p className="text-sm text-muted-foreground">
                Metrics, suggestions, device integrations
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 transition-all duration-200 hover:scale-[1.02]">
            <Smartphone className="h-4 w-4" />
            Connect device
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Avg. sleep (7 days)</span>
              <span className="text-2xl font-bold text-foreground">7.2h</span>
            </div>
            <Progress value={72} className="mt-2 h-2" />
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Recovery score</span>
              <span className="text-2xl font-bold text-accent-green">84%</span>
            </div>
            <Progress value={84} className="mt-2 h-2" />
          </div>
        </div>

        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <Activity className="h-4 w-4" />
            Sleep trend
          </h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SLEEP_DATA}>
                <defs>
                  <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(70, 195, 247)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="rgb(70, 195, 247)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(63, 63, 70)" opacity={0.5} />
                <XAxis dataKey="day" stroke="rgb(129, 129, 138)" fontSize={12} />
                <YAxis stroke="rgb(129, 129, 138)" fontSize={12} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    background: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number | undefined) => [value != null ? `${value}h` : '', 'Sleep']}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="rgb(70, 195, 247)"
                  fill="url(#sleepGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <TrendingUp className="h-4 w-4" />
            AI suggestions
          </h4>
          <ul className="space-y-2">
            {MOCK_SUGGESTIONS.map((suggestion, i) => (
              <li
                key={i}
                className={cn(
                  'flex items-start gap-2 rounded-lg border border-border bg-secondary/20 p-3',
                  'transition-all duration-200 hover:border-accent/30'
                )}
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
