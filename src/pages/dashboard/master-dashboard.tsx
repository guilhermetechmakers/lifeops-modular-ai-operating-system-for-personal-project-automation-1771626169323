import { Plus, Bot, Clock, DollarSign, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'

const mockStats = [
  { label: 'Active Agents', value: '12', change: '+2', icon: Bot, color: 'text-accent' },
  { label: 'Cronjobs', value: '8', change: '+1', icon: Clock, color: 'text-accent-blue' },
  { label: 'Monthly Spend', value: '$124', change: '-12%', icon: DollarSign, color: 'text-accent-green' },
]

const mockRuns = [
  { id: '1', name: 'Content Sync', status: 'success', time: '2 min ago' },
  { id: '2', name: 'Finance Report', status: 'success', time: '15 min ago' },
  { id: '3', name: 'PR Summary', status: 'running', time: 'Now' },
  { id: '4', name: 'Health Check', status: 'pending', time: 'Scheduled' },
]

const mockApprovals = [
  { id: '1', action: 'Publish blog post', agent: 'Content Agent', time: '5 min ago' },
  { id: '2', action: 'Merge PR #42', agent: 'Dev Agent', time: '12 min ago' },
]

const chartData = [
  { name: 'Mon', runs: 12, spend: 24 },
  { name: 'Tue', runs: 19, spend: 38 },
  { name: 'Wed', runs: 15, spend: 31 },
  { name: 'Thu', runs: 22, spend: 45 },
  { name: 'Fri', runs: 18, spend: 36 },
  { name: 'Sat', runs: 8, spend: 16 },
  { name: 'Sun', runs: 14, spend: 28 },
]

export function MasterDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Master Dashboard
          </h1>
          <p className="text-muted-foreground">
            Your command center for agents, cronjobs, and approvals
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Quick Create
        </Button>
      </div>

      {/* Overview widgets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockStats.map((stat, i) => (
          <Card key={stat.label} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={cn('h-4 w-4', stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent-green">{stat.change}</span> from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Runs and spend over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(var(--accent))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="name" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="rgb(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--card))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                    labelStyle={{ color: 'rgb(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="runs"
                    stroke="rgb(var(--accent))"
                    fillOpacity={1}
                    fill="url(#colorRuns)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Approvals queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Approvals Queue</CardTitle>
              <CardDescription>Pending your review</CardDescription>
            </div>
            <Link to="/dashboard/approvals">
              <Button variant="ghost" size="sm">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.agent} · {item.time}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              ))}
              {mockApprovals.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No pending approvals
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent runs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Runs</CardTitle>
            <CardDescription>Latest cronjob executions</CardDescription>
          </div>
          <Link to="/dashboard/cronjobs-dashboard">
            <Button variant="ghost" size="sm">
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Job
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Time
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockRuns.map((run) => (
                  <tr
                    key={run.id}
                    className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                  >
                    <td className="py-3 text-sm font-medium text-foreground">
                      {run.name}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          run.status === 'success'
                            ? 'success'
                            : run.status === 'running'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {run.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {run.time}
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
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
