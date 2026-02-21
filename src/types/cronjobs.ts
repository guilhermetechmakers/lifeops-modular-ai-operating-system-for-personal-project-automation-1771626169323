export interface CronjobsDashboard {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export type AutomationLevel =
  | 'full'
  | 'assisted'
  | 'manual'
  | 'suggest_only'
  | 'approval_required'
  | 'conditional_auto_execute'
  | 'bounded_autopilot'
export type CronjobStatus = 'active' | 'paused' | 'draft'
export type TriggerType = 'cron' | 'manual' | 'webhook' | 'time' | 'event' | 'conditional'

export interface CronjobConstraints {
  max_actions?: number
  spend_limit?: number
  allowed_tools?: string[]
}

export interface RetryPolicy {
  max_retries: number
  backoff_ms: number
}

export interface DeadLetterPolicy {
  enabled?: boolean
  max_retries_before_dlq?: number
  dlq_target?: string
}

export interface Cronjob {
  id: string
  user_id: string
  name: string
  title?: string
  description?: string
  schedule: string
  timezone: string
  target: string
  automation_level: AutomationLevel
  status: CronjobStatus
  trigger_type: TriggerType
  payload?: Record<string, unknown>
  payload_schema?: Record<string, { type: string; sample?: unknown }>
  constraints?: string[] | CronjobConstraints
  safety_rails?: string[]
  retry_policy?: RetryPolicy
  dead_letter_policy?: DeadLetterPolicy
  created_at: string
  updated_at: string
}

export interface CronjobRun {
  id: string
  cronjob_id: string
  status: 'success' | 'failed' | 'running' | 'pending'
  started_at: string
  completed_at?: string
  logs?: string
  artifacts?: Record<string, unknown>
  error?: string
}

export interface CronjobPermission {
  user_id: string
  can_edit: boolean
  can_approve: boolean
  can_run: boolean
}
