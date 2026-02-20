export interface MasterDashboard {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface DashboardOverview {
  liveAgentsCount: number
  cronjobsNextRuns: number
  pendingApprovals: number
  monthlySpend: number
}

export interface ActiveCronjob {
  id: string
  name: string
  target: string
  schedule: string
  nextRun: string
  lastOutcome: 'success' | 'failed' | 'running' | 'pending'
  enabled: boolean
}

export interface ApprovalItem {
  id: string
  action: string
  agent: string
  type: 'content' | 'code' | 'finance'
  time: string
  cost?: string
}

export interface RecentRun {
  id: string
  name: string
  status: 'success' | 'failed' | 'running' | 'pending'
  time: string
  logsLink?: string
}

export interface ActivityEvent {
  id: string
  type: 'message' | 'alert'
  fromAgent?: string
  toAgent?: string
  message: string
  timestamp: string
}
