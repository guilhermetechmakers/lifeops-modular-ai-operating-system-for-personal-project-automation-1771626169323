import { Zap, Battery, BatteryMedium, BatteryLow, Plus, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/loading-states/EmptyState'
import { SkeletonCard } from '@/components/ui/loading-states/SkeletonCard'
import { ErrorState } from '@/components/ui/loading-states/ErrorState'
import { cn } from '@/lib/utils'
import type { WorkloadTask } from '@/types/health'

const MOCK_TASKS: WorkloadTask[] = [
  { id: '1', title: 'Deep work: Project proposal', energyLevel: 'high', scheduledSlot: '9:00 AM', completed: false },
  { id: '2', title: 'Email triage', energyLevel: 'low', scheduledSlot: '2:00 PM', completed: true },
  { id: '3', title: 'Creative brainstorming', energyLevel: 'high', scheduledSlot: '10:00 AM', completed: false },
  { id: '4', title: 'Routine admin tasks', energyLevel: 'low', scheduledSlot: '4:00 PM', completed: false },
]

const ENERGY_ICONS = {
  high: Battery,
  medium: BatteryMedium,
  low: BatteryLow,
}

const ENERGY_COLORS = {
  high: 'text-accent-green',
  medium: 'text-amber-400',
  low: 'text-muted-foreground',
}

interface WorkloadBalancerProps {
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

export function WorkloadBalancer({
  isLoading = false,
  hasError = false,
  onRetry,
}: WorkloadBalancerProps) {
  if (hasError) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <ErrorState
            title="Failed to load workload"
            message="We couldn't load your workload balance."
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <SkeletonCard rows={4} showHeader />
  }

  if (MOCK_TASKS.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <EmptyState
            icon={Zap}
            heading="No tasks linked"
            description="Link tasks to your energy levels and schedule. The balancer will suggest optimal times."
            actionLabel="Add first task"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    )
  }

  const byEnergy = {
    high: MOCK_TASKS.filter((t) => t.energyLevel === 'high'),
    medium: MOCK_TASKS.filter((t) => t.energyLevel === 'medium'),
    low: MOCK_TASKS.filter((t) => t.energyLevel === 'low'),
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="border-b border-border bg-gradient-to-br from-accent-green/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green/10">
              <Zap className="h-5 w-5 text-accent-green" />
            </div>
            <div>
              <CardTitle className="text-lg">Workload Balancer</CardTitle>
              <p className="text-sm text-muted-foreground">
                Tasks linked to energy levels and schedules
              </p>
            </div>
          </div>
          <Button size="sm" className="transition-all duration-200 hover:scale-[1.02]">
            <Plus className="mr-2 h-4 w-4" />
            Add task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {(['high', 'medium', 'low'] as const).map((level) => {
          const tasks = byEnergy[level]
          const Icon = ENERGY_ICONS[level]
          if (tasks.length === 0) return null
          return (
            <div key={level}>
              <h4 className={cn('mb-2 flex items-center gap-2 text-sm font-medium', ENERGY_COLORS[level])}>
                <Icon className="h-4 w-4" />
                {level.charAt(0).toUpperCase() + level.slice(1)} energy
              </h4>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3',
                      'transition-all duration-200 hover:border-accent/30',
                      task.completed && 'opacity-60'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', ENERGY_COLORS[level])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={cn('font-medium text-foreground', task.completed && 'line-through')}>
                          {task.title}
                        </p>
                        {task.scheduledSlot && (
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {task.scheduledSlot}
                          </div>
                        )}
                      </div>
                    </div>
                    {task.completed && (
                      <Badge variant="success" className="text-xs">
                        Done
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
