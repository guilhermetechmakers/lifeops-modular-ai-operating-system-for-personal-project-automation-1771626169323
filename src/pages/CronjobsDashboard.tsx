import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, ChevronRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  CronjobList,
  CronjobDetailsPanel,
  RunHistoryTab,
  CreateEditWizard,
  CronjobActions,
  PermissionsMatrix,
} from '@/components/cronjobs-dashboard'
import {
  fetchCronjobs,
  createCronjob,
  updateCronjob,
  deleteCronjob,
  runCronjobNow,
} from '@/api/cronjobs'
import type { Cronjob, CronjobRun } from '@/types/cronjobs'

const MOCK_CRONJOBS: Cronjob[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Daily Content Sync',
    schedule: '0 9 * * *',
    timezone: 'UTC',
    target: 'content-sync-agent',
    automation_level: 'assisted',
    status: 'active',
    trigger_type: 'cron',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Finance Report',
    schedule: '0 0 * * 0',
    timezone: 'America/New_York',
    target: 'finance-agent',
    automation_level: 'manual',
    status: 'active',
    trigger_type: 'cron',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'user-1',
    name: 'PR Summary',
    schedule: '*/30 * * * *',
    timezone: 'UTC',
    target: 'pr-summary-workflow',
    automation_level: 'full',
    status: 'paused',
    trigger_type: 'cron',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function CronjobsDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cronjobs, setCronjobs] = useState<Cronjob[]>([])
  const [selectedCronjob, setSelectedCronjob] = useState<Cronjob | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [wizardEditData, setWizardEditData] = useState<Cronjob | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [runningId, setRunningId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [runDetail, setRunDetail] = useState<CronjobRun | null>(null)

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      setShowWizard(true)
      setWizardEditData(null)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const loadCronjobs = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const data = await fetchCronjobs()
      setCronjobs(data)
      if (selectedCronjob && !data.find((c) => c.id === selectedCronjob.id)) {
        setSelectedCronjob(null)
      }
    } catch {
      setCronjobs(MOCK_CRONJOBS)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCronjob?.id])

  useEffect(() => {
    loadCronjobs()
  }, [loadCronjobs])

  const handleCreate = () => {
    setWizardEditData(null)
    setShowWizard(true)
  }

  const handleEdit = (cronjob: Cronjob) => {
    setWizardEditData(cronjob)
    setShowWizard(true)
  }

  const handleWizardSubmit = async (
    data: Omit<Cronjob, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    setIsSubmitting(true)
    try {
      if (wizardEditData?.id) {
        const updated = await updateCronjob(wizardEditData.id, data)
        setCronjobs((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        setSelectedCronjob(updated)
        toast.success('Cronjob updated')
      } else {
        const created = await createCronjob(data)
        setCronjobs((prev) => [created, ...prev])
        setSelectedCronjob(created)
        toast.success('Cronjob created')
      }
      setShowWizard(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save cronjob')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRunNow = async (id: string) => {
    setRunningId(id)
    try {
      await runCronjobNow(id)
      toast.success('Run triggered')
    } catch {
      toast.error('Failed to trigger run')
    } finally {
      setRunningId(null)
    }
  }

  const handlePause = async (id: string) => {
    const job = cronjobs.find((c) => c.id === id)
    if (!job) return
    const newStatus = job.status === 'paused' ? 'active' : 'paused'
    try {
      const updated = await updateCronjob(id, { status: newStatus })
      setCronjobs((prev) => prev.map((c) => (c.id === id ? updated : c)))
      setSelectedCronjob((s) => (s?.id === id ? updated : s))
      toast.success(newStatus === 'paused' ? 'Cronjob paused' : 'Cronjob resumed')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleClone = async (cronjob: Cronjob) => {
    try {
      const { id: _id, user_id: _uid, created_at: _ca, updated_at: _ua, ...rest } = cronjob
      const created = await createCronjob({ ...rest, name: `${cronjob.name} (Copy)` })
      setCronjobs((prev) => [created, ...prev])
      setSelectedCronjob(created)
      toast.success('Cronjob cloned')
    } catch {
      toast.error('Failed to clone cronjob')
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return
    try {
      await deleteCronjob(deleteConfirmId)
      setCronjobs((prev) => prev.filter((c) => c.id !== deleteConfirmId))
      if (selectedCronjob?.id === deleteConfirmId) setSelectedCronjob(null)
      setDeleteConfirmId(null)
      toast.success('Cronjob deleted')
    } catch {
      toast.error('Failed to delete cronjob')
    }
  }

  const handleDetailsUpdate = async (updates: Partial<Cronjob>) => {
    if (!selectedCronjob) return
    try {
      const updated = await updateCronjob(selectedCronjob.id, updates)
      setCronjobs((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      setSelectedCronjob(updated)
      toast.success('Details updated')
    } catch {
      toast.error('Failed to update')
    }
  }

  if (showWizard) {
    return (
      <div className="space-y-8 animate-fade-in">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/dashboard/cronjobs-dashboard" className="hover:text-foreground transition-colors">Cronjobs</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{wizardEditData ? 'Edit' : 'Create'}</span>
        </nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {wizardEditData ? 'Edit Cronjob' : 'Create Cronjob'}
            </h1>
            <p className="text-muted-foreground">
              Stepper for defining cronjob fields with validation
            </p>
          </div>
        </div>
        <div className="max-w-2xl">
          <CreateEditWizard
            initialData={wizardEditData ?? undefined}
            onSubmit={handleWizardSubmit}
            onCancel={() => setShowWizard(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Cronjobs</span>
      </nav>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Cronjobs Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage scheduled jobs and workflows: create, edit, enable/disable, view run history
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Cronjob
        </Button>
      </div>

      {hasError && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-foreground">Using demo data. Connect to API for live data.</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadCronjobs}>
            Retry
          </Button>
        </div>
      )}

      <CronjobList
        cronjobs={cronjobs}
        isLoading={isLoading}
        onSelect={setSelectedCronjob}
        selectedId={selectedCronjob?.id}
        onCreateClick={handleCreate}
      />

      {selectedCronjob && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">Run History</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <CronjobDetailsPanel
                  cronjob={selectedCronjob}
                  onUpdate={handleDetailsUpdate}
                />
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <RunHistoryTab
                  cronjobId={selectedCronjob.id}
                  onRunNow={() => handleRunNow(selectedCronjob.id)}
                  onRunDetail={setRunDetail}
                />
              </TabsContent>
            </Tabs>
          </div>
          <div className="space-y-6">
            <CronjobActions
              cronjob={selectedCronjob}
              onRunNow={handleRunNow}
              onPause={handlePause}
              onClone={handleClone}
              onExport={() => toast.success('Cronjob exported')}
              onDelete={handleDeleteClick}
              onEdit={handleEdit}
              isRunning={runningId === selectedCronjob.id}
            />
            <PermissionsMatrix cronjob={selectedCronjob} />
          </div>
        </div>
      )}

      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent showClose>
          <DialogHeader>
            <DialogTitle>Delete Cronjob</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this cronjob? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!runDetail} onOpenChange={(open) => !open && setRunDetail(null)}>
        <DialogContent showClose className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Run Detail</DialogTitle>
            <DialogDescription>
              {runDetail && new Date(runDetail.started_at).toLocaleString()} — {runDetail?.status}
            </DialogDescription>
          </DialogHeader>
          {runDetail && (
            <div className="space-y-4 text-sm">
              {runDetail.logs && (
                <div>
                  <p className="font-medium text-foreground mb-2">Logs</p>
                  <pre className="rounded-lg bg-secondary p-4 overflow-x-auto font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                    {runDetail.logs}
                  </pre>
                </div>
              )}
              {runDetail.error && (
                <div>
                  <p className="font-medium text-red-400 mb-2">Error</p>
                  <pre className="rounded-lg bg-red-500/10 p-4 overflow-x-auto font-mono text-xs text-red-400 whitespace-pre-wrap">
                    {runDetail.error}
                  </pre>
                </div>
              )}
              {runDetail.artifacts && Object.keys(runDetail.artifacts).length > 0 && (
                <div>
                  <p className="font-medium text-foreground mb-2">Artifacts</p>
                  <pre className="rounded-lg bg-secondary p-4 overflow-x-auto font-mono text-xs text-muted-foreground">
                    {JSON.stringify(runDetail.artifacts, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
