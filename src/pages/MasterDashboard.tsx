import { useState, useCallback, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import {
  TopNav,
  OverviewWidgets,
  ActiveCronjobsTable,
  ApprovalsQueuePanel,
  RecentRunsFeed,
  GlobalActivityTimeline,
  QuickCreateModal,
} from '@/components/master-dashboard'
import { ErrorState } from '@/components/ui/loading-states'
import {
  fetchMasterDashboardData,
  approveItem,
  rejectItem,
  toggleCronjob,
} from '@/api/master-dashboard'

interface OutletContext {
  setMobileOpen?: (v: boolean) => void
}

export default function MasterDashboardPage() {
  const { setMobileOpen } = useOutletContext<OutletContext>() ?? {}
  const [showQuickCreate, setShowQuickCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchMasterDashboardData>> | null>(
    null
  )

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const result = await fetchMasterDashboardData()
      setData(result)
    } catch {
      setHasError(true)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleApprove = async (id: string) => {
    try {
      await approveItem(id)
      setData((prev) =>
        prev
          ? {
              ...prev,
              approvals: prev.approvals.filter((a) => a.id !== id),
              overview: {
                ...prev.overview,
                pendingApprovals: Math.max(0, prev.overview.pendingApprovals - 1),
              },
            }
          : null
      )
      toast.success('Approved')
    } catch {
      toast.error('Failed to approve')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectItem(id)
      setData((prev) =>
        prev
          ? {
              ...prev,
              approvals: prev.approvals.filter((a) => a.id !== id),
              overview: {
                ...prev.overview,
                pendingApprovals: Math.max(0, prev.overview.pendingApprovals - 1),
              },
            }
          : null
      )
      toast.success('Rejected')
    } catch {
      toast.error('Failed to reject')
    }
  }

  const handleToggleCronjob = async (id: string, enabled: boolean) => {
    try {
      await toggleCronjob(id, enabled)
      setData((prev) =>
        prev
          ? {
              ...prev,
              activeCronjobs: prev.activeCronjobs.map((c) =>
                c.id === id ? { ...c, enabled } : c
              ),
            }
          : null
      )
      toast.success(enabled ? 'Cronjob enabled' : 'Cronjob disabled')
    } catch {
      toast.error('Failed to update cronjob')
    }
  }

  return (
    <div className="space-y-8">
      <TopNav
        onGlobalCreate={() => setShowQuickCreate(true)}
        showMenuButton
        onMenuClick={() => setMobileOpen?.(true)}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Master Dashboard
          </h1>
          <p className="text-muted-foreground">
            Your command center for agents, cronjobs, and approvals
          </p>
        </div>
      </div>

      {hasError && (
        <ErrorState
          title="Using demo data"
          message="Could not connect to the API. Displaying demo data. Connect to the API for live data."
          onRetry={loadData}
          retryLabel="Retry connection"
        />
      )}

      <OverviewWidgets data={data?.overview ?? null} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActiveCronjobsTable
            cronjobs={data?.activeCronjobs}
            isLoading={isLoading}
            onToggle={handleToggleCronjob}
          />
        </div>
        <div>
          <ApprovalsQueuePanel
            items={data?.approvals}
            isLoading={isLoading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentRunsFeed runs={data?.recentRuns} isLoading={isLoading} />
        </div>
        <div>
          <GlobalActivityTimeline events={data?.activityTimeline} isLoading={isLoading} />
        </div>
      </div>

      <QuickCreateModal open={showQuickCreate} onOpenChange={setShowQuickCreate} />
    </div>
  )
}
