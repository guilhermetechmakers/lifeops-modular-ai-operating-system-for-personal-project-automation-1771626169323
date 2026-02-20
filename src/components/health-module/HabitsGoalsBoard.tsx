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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/loading-states/EmptyState'
import { SkeletonCard } from '@/components/ui/loading-states/SkeletonCard'
import { ErrorState } from '@/components/ui/loading-states/ErrorState'
import { cn } from '@/lib/utils'
import type { Habit } from '@/types/health'

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
        <CardContent className="pt-6">
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
        <CardContent className="pt-6">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">Habits & Goals</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track streaks and get AI recommendations
              </p>
            </div>
          </div>
          <Button size="sm" className="transition-all duration-200 hover:scale-[1.02]">
            <Plus className="mr-2 h-4 w-4" />
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
                'flex items-center justify-between gap-4 px-6 py-4 transition-all duration-200 hover:bg-secondary/30',
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
                      ? 'border-accent-green bg-accent-green/20 text-accent-green'
                      : 'border-border bg-secondary/50 hover:border-accent/50'
                  )}
                  aria-label={completedToday.has(habit.id) ? 'Mark incomplete' : 'Mark complete'}
                >
                  {completedToday.has(habit.id) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{habit.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {habit.frequency}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame className="h-3.5 w-3.5 text-accent" />
                      {habit.streak} day streak
                    </span>
                  </div>
                  {habit.aiRecommendation && (
                    <div className="mt-2 flex items-start gap-2 rounded-lg bg-accent/5 p-2">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-purple" />
                      <p className="text-xs text-muted-foreground">{habit.aiRecommendation}</p>
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="border-t border-border bg-secondary/20 px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-accent-green" />
            <span>
              Best streak: {Math.max(...habits.map((h) => h.streak), 0)} days — keep it up!
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
