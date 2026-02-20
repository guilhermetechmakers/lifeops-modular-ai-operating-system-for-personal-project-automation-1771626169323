/** Health module item (habits, goals, plans, etc.) */
export interface HealthHealthModule {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** Habit with streak tracking */
export interface Habit {
  id: string
  title: string
  frequency: 'daily' | 'weekly' | 'custom'
  streak: number
  lastCompleted?: string
  aiRecommendation?: string
}

/** Training or meal plan item */
export interface PlanItem {
  id: string
  type: 'training' | 'meal'
  title: string
  scheduledAt: string
  duration?: number
  calories?: number
  syncedToCalendar?: boolean
}

/** Recovery/sleep metrics */
export interface RecoveryMetric {
  id: string
  type: 'sleep' | 'recovery'
  score?: number
  duration?: number
  date: string
  source?: string
  suggestion?: string
}

/** Workload task linked to energy level */
export interface WorkloadTask {
  id: string
  title: string
  energyLevel: 'low' | 'medium' | 'high'
  scheduledSlot?: string
  completed: boolean
}

/** Health log entry */
export interface HealthLog {
  id: string
  type: 'manual' | 'device'
  category: string
  value: string | number
  unit?: string
  loggedAt: string
  source?: string
}
