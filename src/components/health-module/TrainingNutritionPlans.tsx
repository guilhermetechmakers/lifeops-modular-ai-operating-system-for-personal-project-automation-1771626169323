import { Dumbbell, UtensilsCrossed, Calendar, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/loading-states/EmptyState'
import { SkeletonCard } from '@/components/ui/loading-states/SkeletonCard'
import { ErrorState } from '@/components/ui/loading-states/ErrorState'
import { cn } from '@/lib/utils'
import type { PlanItem } from '@/types/health'

const MOCK_TRAINING: PlanItem[] = [
  {
    id: '1',
    type: 'training',
    title: 'Upper body strength',
    scheduledAt: new Date().toISOString(),
    duration: 45,
    syncedToCalendar: true,
  },
  {
    id: '2',
    type: 'training',
    title: 'HIIT cardio',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    duration: 30,
    syncedToCalendar: false,
  },
]

const MOCK_MEALS: PlanItem[] = [
  {
    id: '3',
    type: 'meal',
    title: 'Oatmeal with berries',
    scheduledAt: new Date().toISOString(),
    calories: 350,
    syncedToCalendar: true,
  },
  {
    id: '4',
    type: 'meal',
    title: 'Grilled chicken salad',
    scheduledAt: new Date(Date.now() + 3600000 * 5).toISOString(),
    calories: 450,
    syncedToCalendar: false,
  },
]

interface TrainingNutritionPlansProps {
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

export function TrainingNutritionPlans({
  isLoading = false,
  hasError = false,
  onRetry,
}: TrainingNutritionPlansProps) {
  const hasPlans = MOCK_TRAINING.length > 0 || MOCK_MEALS.length > 0

  if (hasError) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <ErrorState
            title="Failed to load plans"
            message="We couldn't load your training and nutrition plans."
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <SkeletonCard rows={3} showHeader />
  }

  if (!hasPlans) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <EmptyState
            icon={Dumbbell}
            heading="No plans yet"
            description="Get AI-generated training and meal plans. Sync to your calendar for seamless scheduling."
            actionLabel="Generate plan"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="border-b border-border bg-gradient-to-br from-accent-purple/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-purple/10">
              <Dumbbell className="h-5 w-5 text-accent-purple" />
            </div>
            <div>
              <CardTitle className="text-lg">Training & Nutrition</CardTitle>
              <p className="text-sm text-muted-foreground">
                Agent-generated plans, calendar sync
              </p>
            </div>
          </div>
          <Button size="sm" className="transition-all duration-200 hover:scale-[1.02]">
            <Plus className="mr-2 h-4 w-4" />
            Add plan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="training">
          <TabsList className="mb-4">
            <TabsTrigger value="training" className="gap-2">
              <Dumbbell className="h-4 w-4" />
              Training
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Nutrition
            </TabsTrigger>
          </TabsList>
          <TabsContent value="training" className="mt-0 space-y-3">
            {MOCK_TRAINING.map((item) => (
              <PlanItemCard key={item.id} item={item} />
            ))}
          </TabsContent>
          <TabsContent value="nutrition" className="mt-0 space-y-3">
            {MOCK_MEALS.map((item) => (
              <PlanItemCard key={item.id} item={item} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function PlanItemCard({ item }: { item: PlanItem }) {
  const time = new Date(item.scheduledAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
  const Icon = item.type === 'training' ? Dumbbell : UtensilsCrossed

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4',
        'transition-all duration-200 hover:border-accent/30 hover:bg-secondary/50'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="font-medium text-foreground">{item.title}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{time}</span>
            {item.duration && (
              <Badge variant="outline" className="text-xs">
                {item.duration} min
              </Badge>
            )}
            {item.calories && (
              <Badge variant="outline" className="text-xs">
                {item.calories} cal
              </Badge>
            )}
            {item.syncedToCalendar && (
              <Badge variant="success" className="gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                Synced
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
