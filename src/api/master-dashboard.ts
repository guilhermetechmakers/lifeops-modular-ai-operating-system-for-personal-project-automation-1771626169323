import type {
  DashboardOverview,
  ActiveCronjob,
  ApprovalItem,
  RecentRun,
  ActivityEvent,
} from '@/types/master-dashboard'

const MASTER_DASHBOARD_BASE = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL
  ? `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/master-dashboard`
  : undefined

async function masterDashboardFetch<T>(body: object): Promise<T> {
  if (MASTER_DASHBOARD_BASE) {
    const res = await fetch(MASTER_DASHBOARD_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as { error?: string }).error ?? res.statusText)
    }
    return res.json()
  }
  throw new Error('Master dashboard API not configured')
}

export interface MasterDashboardData {
  overview: DashboardOverview
  activeCronjobs: ActiveCronjob[]
  approvals: ApprovalItem[]
  recentRuns: RecentRun[]
  activityTimeline: ActivityEvent[]
}

export async function fetchMasterDashboardData(): Promise<MasterDashboardData> {
  if (MASTER_DASHBOARD_BASE) {
    const res = await masterDashboardFetch<{ data: MasterDashboardData }>({
      action: 'get_dashboard',
    })
    return (res as { data: MasterDashboardData }).data
  }
  return getMockMasterDashboardData()
}

function getMockMasterDashboardData(): MasterDashboardData {
  return {
    overview: {
      liveAgentsCount: 12,
      cronjobsNextRuns: 8,
      pendingApprovals: 3,
      monthlySpend: 124,
    },
    activeCronjobs: [
      {
        id: '1',
        name: 'Daily Content Sync',
        target: 'content-sync-agent',
        schedule: '0 9 * * *',
        nextRun: 'In 2h',
        lastOutcome: 'success',
        enabled: true,
      },
      {
        id: '2',
        name: 'Finance Report',
        target: 'finance-agent',
        schedule: '0 0 * * 0',
        nextRun: 'Sun 00:00',
        lastOutcome: 'success',
        enabled: true,
      },
      {
        id: '3',
        name: 'PR Summary',
        target: 'pr-summary-workflow',
        schedule: '*/30 * * * *',
        nextRun: 'In 15 min',
        lastOutcome: 'running',
        enabled: false,
      },
    ],
    approvals: [
      {
        id: '1',
        action: 'Publish blog post "Getting Started with LifeOps"',
        agent: 'Content Agent',
        type: 'content',
        time: '5 min ago',
        cost: '$0.02',
      },
      {
        id: '2',
        action: 'Merge PR #42: Add dashboard widgets',
        agent: 'Dev Agent',
        type: 'code',
        time: '12 min ago',
        cost: '$0.05',
      },
      {
        id: '3',
        action: 'Create invoice for Client XYZ',
        agent: 'Finance Agent',
        type: 'finance',
        time: '1h ago',
        cost: '$0.01',
      },
    ],
    recentRuns: [
      { id: '1', name: 'Content Sync', status: 'success', time: '2 min ago' },
      { id: '2', name: 'Finance Report', status: 'success', time: '15 min ago' },
      { id: '3', name: 'PR Summary', status: 'running', time: 'Now' },
      { id: '4', name: 'Health Check', status: 'pending', time: 'Scheduled' },
    ],
    activityTimeline: [
      {
        id: '1',
        type: 'message',
        fromAgent: 'Content Agent',
        toAgent: 'Dev Agent',
        message: 'PR #42 ready for review',
        timestamp: '2 min ago',
      },
      {
        id: '2',
        type: 'alert',
        message: 'Finance Report completed successfully',
        timestamp: '15 min ago',
      },
      {
        id: '3',
        type: 'message',
        fromAgent: 'Dev Agent',
        toAgent: 'Content Agent',
        message: 'Merge approved',
        timestamp: '20 min ago',
      },
    ],
  }
}

export async function approveItem(id: string): Promise<void> {
  if (MASTER_DASHBOARD_BASE) {
    await masterDashboardFetch({ action: 'approve', id })
  }
  // Demo mode: no-op, caller updates local state
}

export async function rejectItem(id: string): Promise<void> {
  if (MASTER_DASHBOARD_BASE) {
    await masterDashboardFetch({ action: 'reject', id })
  }
  // Demo mode: no-op, caller updates local state
}

export async function toggleCronjob(id: string, enabled: boolean): Promise<void> {
  if (MASTER_DASHBOARD_BASE) {
    await masterDashboardFetch({ action: 'toggle_cronjob', id, enabled })
  }
  // Demo mode: no-op, caller updates local state
}
