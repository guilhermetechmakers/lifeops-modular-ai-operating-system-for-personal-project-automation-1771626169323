import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Calendar, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  HabitsGoalsBoard,
  TrainingNutritionPlans,
  RecoverySleepInsights,
  WorkloadBalancer,
  HealthLogs,
} from '@/components/health-module'
import { fetchHealthItems } from '@/api/health'

export default function HealthModule() {
  useEffect(() => {
    document.title = 'Health — LifeOps'
    return () => {
      document.title = 'LifeOps — AI Operating System for Life & Projects'
    }
  }, [])

  const {
    data: healthItems = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['health-items'],
    queryFn: fetchHealthItems,
    retry: 1,
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard" className="transition-colors hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Health</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Health
          </h1>
          <p className="text-muted-foreground">
            Personal health automation: habits, training & meal plans, recovery tracking, and workload balancing with agent nudges.
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-accent to-primary transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
        >
          <Link to="/dashboard/cronjobs-dashboard?create=1">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule habit nudges
          </Link>
        </Button>
      </div>

      {isError && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-foreground">Using demo data. Connect to API for live sync.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <HabitsGoalsBoard
            isLoading={isLoading}
            hasError={false}
            onRetry={() => refetch()}
          />
        </div>

        <TrainingNutritionPlans
          isLoading={isLoading}
          hasError={false}
          onRetry={() => refetch()}
        />

        <RecoverySleepInsights
          isLoading={isLoading}
          hasError={false}
          onRetry={() => refetch()}
        />

        <WorkloadBalancer
          isLoading={isLoading}
          hasError={false}
          onRetry={() => refetch()}
        />

        <div className="lg:col-span-2">
          <HealthLogs
            isLoading={isLoading}
            hasError={false}
            onRetry={() => refetch()}
          />
        </div>
      </div>

      {healthItems.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            {healthItems.length} health item(s) synced. Integrate with Cronjobs for proactive nudges and health checks.
          </p>
        </div>
      )}
    </div>
  )
}
