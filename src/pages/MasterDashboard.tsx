import { useState, useEffect, useDeferredValue } from 'react'
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
import {
  useMasterDashboard,
  useApproveItem,
  useRejectItem,
  useToggleCronjob,
} from '@/hooks/use-master-dashboard'
import { ErrorState } from '@/components/ui/loading-states'

interface OutletContext {
  setMobileOpen?: (v: boolean) => void
}

export default function MasterDashboardPage() {
  const { setMobileOpen } = useOutletContext<OutletContext>() ?? {}
  const [showQuickCreate, setShowQuickCreate] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const { data, isLoading, isError, refetch } = useMasterDashboard()
  const approveMutation = useApproveItem()
  const rejectMutation = useRejectItem()
  const toggleMutation = useToggleCronjob()

  useEffect(() => {
    document.title = 'Master Dashboard — LifeOps'
    return () => {
      document.title = 'LifeOps — AI Operating System for Life & Projects'
    }
  }, [])

  const handleApprove = async (id: string) => {
    const toastId = toast.loading('Approving...')
    try {
      await approveMutation.mutateAsync(id)
      toast.success('Approved', { id: toastId })
    } catch {
      toast.error('Failed to approve', { id: toastId })
    }
  }

  const handleReject = async (id: string) => {
    const toastId = toast.loading('Rejecting...')
    try {
      await rejectMutation.mutateAsync(id)
      toast.success('Rejected', { id: toastId })
    } catch {
      toast.error('Failed to reject', { id: toastId })
    }
  }

  const handleToggleCronjob = async (id: string, enabled: boolean) => {
    const toastId = toast.loading(enabled ? 'Enabling cronjob...' : 'Disabling cronjob...')
    try {
      await toggleMutation.mutateAsync({ id, enabled })
      toast.success(enabled ? 'Cronjob enabled' : 'Cronjob disabled', { id: toastId })
    } catch {
      toast.error('Failed to update cronjob', { id: toastId })
    }
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
        <ErrorState
          title="Failed to load dashboard"
          message="We couldn't load your dashboard data. Please check your connection and try again."
          onRetry={() => refetch()}
          retryLabel="Retry"
          retryAriaLabel="Retry loading dashboard"
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in" role="main" aria-label="Master Dashboard">
      <TopNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGlobalCreate={() => setShowQuickCreate(true)}
        showMenuButton
        onMenuClick={() => setMobileOpen?.(true)}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            <span className="gradient-text">Master Dashboard</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Your command center for agents, cronjobs, and approvals
          </p>
        </div>
      </div>

      <OverviewWidgets data={data?.overview ?? null} isLoading={isLoading} />

      <div
        className="grid gap-6 lg:grid-cols-3 animate-fade-in-up"
        style={{ animationDelay: '100ms' }}
        role="region"
        aria-label="Cronjobs and approvals"
      >
        <div className="lg:col-span-2">
          <ActiveCronjobsTable
            cronjobs={data?.activeCronjobs}
            isLoading={isLoading}
            onToggle={handleToggleCronjob}
            searchQuery={deferredSearchQuery}
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

      <div
        className="grid gap-6 lg:grid-cols-3 animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
        role="region"
        aria-label="Recent runs and activity"
      >
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
