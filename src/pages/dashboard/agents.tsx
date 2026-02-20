import { Plus, Bot, Workflow } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const mockAgents = [
  { id: '1', name: 'Content Agent', persona: 'Content creation & editing', tools: 5, status: 'active' },
  { id: '2', name: 'Dev Agent', persona: 'PR reviews & releases', tools: 8, status: 'active' },
  { id: '3', name: 'Finance Agent', persona: 'Bookkeeping & forecasting', tools: 4, status: 'idle' },
  { id: '4', name: 'Health Agent', persona: 'Habits & recovery', tools: 3, status: 'active' },
]

export function AgentsDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Agents & Workflows
          </h1>
          <p className="text-muted-foreground">
            Create and manage agent instances and multi-agent workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Workflow className="mr-2 h-4 w-4" />
            Workflow Editor
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Agent
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockAgents.map((agent) => (
          <Card
            key={agent.id}
            className="group cursor-pointer transition-all duration-300 hover:border-accent/30 hover:shadow-card-hover"
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Bot className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                  <CardDescription className="text-xs">{agent.persona}</CardDescription>
                </div>
              </div>
              <Badge variant={agent.status === 'active' ? 'success' : 'secondary'}>
                {agent.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{agent.tools} tools</span>
                <Button variant="ghost" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
          <CardDescription>Pre-built multi-agent workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {['Content Pipeline', 'Release Automation', 'Finance Close'].map((name) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
              >
                <span className="font-medium text-foreground">{name}</span>
                <Button variant="outline" size="sm">
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
