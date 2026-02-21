import { Plus, Bot, Workflow } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, ErrorState } from '@/components/ui/loading-states'
import { cn } from '@/lib/utils'

export interface Agent {
  id: string
  name: string
  persona: string
  tools: number
  status: 'active' | 'idle'
}

const mockAgents: Agent[] = [
  { id: '1', name: 'Content Agent', persona: 'Content creation & editing', tools: 5, status: 'active' },
  { id: '2', name: 'Dev Agent', persona: 'PR reviews & releases', tools: 8, status: 'active' },
  { id: '3', name: 'Finance Agent', persona: 'Bookkeeping & forecasting', tools: 4, status: 'idle' },
  { id: '4', name: 'Health Agent', persona: 'Habits & recovery', tools: 3, status: 'active' },
]

export interface AgentsDashboardProps {
  agents?: Agent[]
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
  onAddAgent?: () => void
}

function AgentCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-14 rounded-md" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

export function AgentsDashboard({
  agents = mockAgents,
  isLoading = false,
  hasError = false,
  onRetry,
  onAddAgent,
}: AgentsDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Agents & Workflows
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Create and manage agent instances and multi-agent workflows
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]">
            <Workflow className="mr-2 h-4 w-4" aria-hidden />
            Workflow Editor
          </Button>
          <Button className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]">
            <Plus className="mr-2 h-4 w-4" aria-hidden />
            New Agent
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Your Agents</h2>
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <AgentCardSkeleton key={i} />
            ))}
          </div>
        ) : hasError ? (
          <ErrorState
            title="Failed to load agents"
            message="We couldn't load your agents. Please check your connection and try again."
            onRetry={onRetry}
            retryLabel="Retry"
            retryAriaLabel="Retry loading agents"
          />
        ) : agents.length === 0 ? (
          <EmptyState
            icon={Bot}
            heading="No agents yet"
            description="Create your first agent to automate tasks and workflows. Agents can handle content, development, finance, health, and more."
            actionLabel="New Agent"
            onAction={onAddAgent ?? (() => {})}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className={cn(
                  'group cursor-pointer transition-all duration-300',
                  'hover:border-accent/30 hover:shadow-card-hover hover:-translate-y-0.5',
                  'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background'
                )}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Bot className="h-6 w-6 text-accent" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="truncate text-base">{agent.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">{agent.persona}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={agent.status === 'active' ? 'success' : 'secondary'}
                    className="shrink-0"
                  >
                    {agent.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span>{agent.tools} tools</span>
                    <Button variant="ghost" size="sm" className="shrink-0 transition-all hover:scale-[1.02]">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="transition-all duration-300 hover:shadow-card">
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
          <CardDescription>Pre-built multi-agent workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {['Content Pipeline', 'Release Automation', 'Finance Close'].map((name) => (
              <div
                key={name}
                className={cn(
                  'flex items-center justify-between gap-4 rounded-lg border border-border p-4',
                  'transition-all duration-200 hover:border-accent/20 hover:bg-secondary/50'
                )}
              >
                <span className="font-medium text-foreground">{name}</span>
                <Button variant="outline" size="sm" className="shrink-0 transition-all hover:scale-[1.02]">
                  Use template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
