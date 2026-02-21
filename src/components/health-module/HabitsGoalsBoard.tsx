import { useState } from 'react'
import {
  Target,
  Flame,
  Sparkles,
  Plus,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/loading-states/EmptyState'
import { SkeletonCard } from '@/components/ui/loading-states/SkeletonCard'
import { ErrorState } from '@/components/ui/loading-states/ErrorState'
import { cn } from '@/lib/utils'
import type { Habit } from '@/types/health'

/** Consistent icon sizes: icon-sm (h-4 w-4), icon-md (h-5 w-5) */
const ICON_SM = 'h-4 w-4'
const ICON_MD = 'h-5 w-5'

const MOCK_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Morning meditation',
    frequency: 'daily',
    streak: 12,
    lastCompleted: new Date().toISOString(),
    aiRecommendation: 'Try adding 2 min of breathwork before meditation',
  },
  {
    id: '2',
    title: '10k steps',
    frequency: 'daily',
    streak: 5,
    lastCompleted: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Read 30 min',
    frequency: 'daily',
    streak: 3,
    aiRecommendation: 'Schedule reading during lunch for consistency',
  },
]

interface HabitsGoalsBoardProps {
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

export function HabitsGoalsBoard({
  isLoading = false,
  hasError = false,
  onRetry,
}: HabitsGoalsBoardProps) {
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS)
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set(['1']))

  const handleToggle = (id: string) => {
    const willBeCompleted = !completedToday.has(id)
    setCompletedToday((prev) => {
      const next = new Set(prev)
      if (willBeCompleted) next.add(id)
      else next.delete(id)
      return next
    })
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              streak: willBeCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
              lastCompleted: willBeCompleted ? new Date().toISOString() : h.lastCompleted,
            }
          : h
      )
    )
  }

  if (hasError) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="px-4 pt-6 sm:px-6">
          <ErrorState
            title="Failed to load habits"
            message="We couldn't load your habits. Please try again."
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <SkeletonCard rows={4} showHeader />
  }

  if (habits.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="px-4 pt-6 sm:px-6">
          <EmptyState
            icon={Target}
            heading="No habits yet"
            description="Start building healthy habits. Add your first habit to track streaks and get AI recommendations."
            actionLabel="Add first habit"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="border-b border-border bg-gradient-to-br from-accent/5 to-transparent">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <Target className={cn(ICON_MD, 'text-accent')} aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-none tracking-tight text-foreground">
                Habits & Goals
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Track streaks and get AI recommendations
              </p>
            </div>
          </div>
          <Button size="sm" className="shrink-0 transition-all duration-200 hover:scale-[1.02]">
            <Plus className={cn(ICON_SM, 'mr-2')} aria-hidden />
            Add habit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {habits.map((habit, i) => (
            <div
              key={habit.id}
              className={cn(
                'flex items-center justify-between gap-4 px-4 py-4 transition-all duration-200 hover:bg-secondary/30 sm:px-6',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleToggle(habit.id)}
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-200',
                    completedToday.has(habit.id)
                      ? 'border-success bg-success/20 text-success'
                      : 'border-border bg-secondary/50 hover:border-accent/50'
                  )}
                  aria-label={completedToday.has(habit.id) ? 'Mark incomplete' : 'Mark complete'}
                >
                  {completedToday.has(habit.id) ? (
                    <Check className={ICON_MD} aria-hidden />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" aria-hidden />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{habit.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {habit.frequency}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame className={cn(ICON_SM, 'text-accent')} aria-hidden />
                      {habit.streak} day streak
                    </span>
                  </div>
                  {habit.aiRecommendation && (
                    <div className="mt-2 flex items-start gap-2 rounded-lg bg-accent/5 p-2">
                      <Sparkles className={cn(ICON_SM, 'mt-0.5 shrink-0 text-accent-purple')} aria-hidden />
                      <p className="text-xs text-muted-foreground">{habit.aiRecommendation}</p>
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight className={cn(ICON_MD, 'shrink-0 text-muted-foreground')} aria-hidden />
            </div>
          ))}
        </div>
        <div className="border-t border-border bg-secondary/20 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className={cn(ICON_SM, 'text-success')} aria-hidden />
            <span>
              Best streak: {Math.max(...habits.map((h) => h.streak), 0)} days — keep it up!
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
