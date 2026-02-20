export interface CronjobsDashboard {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export type AutomationLevel = 'full' | 'assisted' | 'manual'
export type CronjobStatus = 'active' | 'paused' | 'draft'

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
  trigger_type: 'cron' | 'manual' | 'webhook'
  payload?: Record<string, unknown>
  constraints?: string[]
  safety_rails?: string[]
  retry_policy?: {
    max_retries: number
    backoff_ms: number
  }
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
