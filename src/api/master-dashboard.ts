import { supabase } from '@/lib/supabase'
import type {
  DashboardOverview,
  ActiveCronjob,
  ApprovalItem,
  RecentRun,
  ActivityEvent,
} from '@/types/master-dashboard'

async function masterDashboardFetch<T>(body: object): Promise<T> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<T>('master-dashboard', { body })
    if (error) throw new Error(error.message)
    if (data == null) throw new Error('No response from master-dashboard')
    return data
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
  if (supabase) {
    try {
      const res = await masterDashboardFetch<{ data: MasterDashboardData }>({
        action: 'get_dashboard',
      })
      return (res as { data: MasterDashboardData }).data
    } catch {
      // Fall back to preseeded demo data when API fails (e.g. unauthenticated, network error)
      return getMockMasterDashboardData()
    }
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
      { id: '1', name: 'Content Sync', status: 'success', time: '2 min ago', logsLink: '/dashboard/cronjobs-dashboard?run=1' },
      { id: '2', name: 'Finance Report', status: 'success', time: '15 min ago', logsLink: '/dashboard/cronjobs-dashboard?run=2' },
      { id: '3', name: 'PR Summary', status: 'running', time: 'Now', logsLink: '/dashboard/cronjobs-dashboard?run=3' },
      { id: '4', name: 'Health Check', status: 'pending', time: 'Scheduled', logsLink: '/dashboard/cronjobs-dashboard?run=4' },
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
  if (supabase) {
    await masterDashboardFetch({ action: 'approve', id })
  }
  // Demo mode: no-op, caller updates local state
}

export async function rejectItem(id: string): Promise<void> {
  if (supabase) {
    await masterDashboardFetch({ action: 'reject', id })
  }
  // Demo mode: no-op, caller updates local state
}

export async function toggleCronjob(id: string, enabled: boolean): Promise<void> {
  if (supabase) {
    await masterDashboardFetch({ action: 'toggle_cronjob', id, enabled })
  }
  // Demo mode: no-op, caller updates local state
}
