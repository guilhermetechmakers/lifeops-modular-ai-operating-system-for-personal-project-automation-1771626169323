import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, AlertTriangle, Download, ExternalLink } from 'lucide-react'
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
  useCronjobs,
  useCreateCronjob,
  useUpdateCronjob,
  useDeleteCronjob,
  useRunCronjobNow,
} from '@/hooks/use-cronjobs'
import { fetchCronjobRun } from '@/api/cronjobs'
import { getRunArtifactUrls } from '@/api/artifacts'
import type { Cronjob, CronjobRun } from '@/types/cronjobs'

interface RunDetailContentProps {
  runDetail: CronjobRun
  artifactUrls: { key: string; url: string; type: string; filename: string }[]
  artifactUrlsLoading: boolean
  onLoadArtifacts: () => void
  runId: string
}

function RunDetailContent({
  runDetail,
  artifactUrls,
  artifactUrlsLoading,
  onLoadArtifacts,
  runId,
}: RunDetailContentProps) {
  useEffect(() => {
    if (!runId) return
    onLoadArtifacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only fetch when runId changes
  }, [runId])
  const hasStoredArtifacts = artifactUrls.length > 0
  const hasInlineArtifacts = runDetail.artifacts && Object.keys(runDetail.artifacts).length > 0

  return (
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
          <p className="font-medium text-destructive mb-2">Error</p>
          <pre className="rounded-lg bg-destructive/10 p-4 overflow-x-auto font-mono text-xs text-destructive whitespace-pre-wrap">
            {runDetail.error}
          </pre>
        </div>
      )}
      {/* S3-compatible artifact storage: signed URLs for download */}
      <div>
        <p className="font-medium text-foreground mb-2">Artifacts & Export</p>
        {artifactUrlsLoading ? (
          <div className="rounded-lg bg-secondary/50 p-4 animate-pulse text-muted-foreground">
            Loading artifact links...
          </div>
        ) : hasStoredArtifacts ? (
          <div className="flex flex-wrap gap-2">
            {artifactUrls.map((a) => (
              <a
                key={a.key}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs font-medium transition-all duration-200 hover:border-accent/50 hover:bg-secondary"
                aria-label={`Download artifact ${a.filename} (${a.type})`}
              >
                <Download className="h-4 w-4" aria-hidden />
                {a.filename} ({a.type})
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <p className="text-xs text-muted-foreground">
              No artifacts in object storage. Run artifacts, diffs, and logs are stored via the S3-compatible API when cronjobs complete.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoadArtifacts}
              disabled={artifactUrlsLoading}
              className="mt-2 transition-all hover:scale-[1.02]"
              aria-label="Retry loading artifact links"
            >
              <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
              Retry
            </Button>
          </div>
        )}
      </div>
      {hasInlineArtifacts && (
        <div>
          <p className="font-medium text-foreground mb-2">Inline Artifacts</p>
          <pre className="rounded-lg bg-secondary p-4 overflow-x-auto font-mono text-xs text-muted-foreground">
            {JSON.stringify(runDetail.artifacts, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

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
  const navigate = useNavigate()
  const [selectedCronjob, setSelectedCronjob] = useState<Cronjob | null>(null)
  const [showWizard, setShowWizard] = useState(false)
  const [wizardEditData, setWizardEditData] = useState<Cronjob | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [runDetail, setRunDetail] = useState<CronjobRun | null>(null)
  const [artifactUrls, setArtifactUrls] = useState<{ key: string; url: string; type: string; filename: string }[]>([])
  const [artifactUrlsLoading, setArtifactUrlsLoading] = useState(false)

  const { data: cronjobsData = [], isLoading, isError: hasError, refetch: refetchCronjobs } = useCronjobs()
  const cronjobs = hasError ? MOCK_CRONJOBS : cronjobsData

  const createMutation = useCreateCronjob()
  const updateMutation = useUpdateCronjob()
  const deleteMutation = useDeleteCronjob()
  const runNowMutation = useRunCronjobNow()

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      setShowWizard(true)
      setWizardEditData(null)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    document.title = 'Cronjobs Dashboard | LifeOps - Manage scheduled jobs and workflows'
    return () => {
      document.title = 'LifeOps'
    }
  }, [])

  const runIdFromUrl = searchParams.get('run')
  useEffect(() => {
    if (!runIdFromUrl) return
    fetchCronjobRun(runIdFromUrl)
      .then((result) => {
        if (result) {
          const { run, cronjob } = result
          const job = cronjobs.find((c) => c.id === cronjob.id) ?? cronjob
          setSelectedCronjob(job)
          setRunDetail(run)
        }
      })
      .catch(() => {
        toast.error('Failed to load run details')
      })
  }, [runIdFromUrl, cronjobs])

  const handleCreate = () => {
    setWizardEditData(null)
    setShowWizard(true)
  }

  const handleEdit = (cronjob: Cronjob) => {
    navigate(`/dashboard/cronjob-editor/${cronjob.id}`)
  }

  const handleWizardSubmit = async (
    data: Omit<Cronjob, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      if (wizardEditData?.id) {
        const updated = await updateMutation.mutateAsync({
          id: wizardEditData.id,
          cronjob: data,
        })
        setSelectedCronjob(updated)
        toast.success('Cronjob updated')
      } else {
        const created = await createMutation.mutateAsync(data)
        setSelectedCronjob(created)
        toast.success('Cronjob created')
      }
      setShowWizard(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save cronjob')
    }
  }

  const handleRunNow = async (id: string) => {
    try {
      await runNowMutation.mutateAsync(id)
      toast.success('Run triggered')
    } catch {
      toast.error('Failed to trigger run')
    }
  }

  const handlePause = async (id: string) => {
    const job = cronjobs.find((c) => c.id === id)
    if (!job) return
    const newStatus = job.status === 'paused' ? 'active' : 'paused'
    try {
      const updated = await updateMutation.mutateAsync({
        id,
        cronjob: { status: newStatus },
      })
      setSelectedCronjob((s) => (s?.id === id ? updated : s))
      toast.success(newStatus === 'paused' ? 'Cronjob paused' : 'Cronjob resumed')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleClone = async (cronjob: Cronjob) => {
    try {
      const { id: _id, user_id: _uid, created_at: _ca, updated_at: _ua, ...rest } = cronjob
      const created = await createMutation.mutateAsync({
        ...rest,
        name: `${cronjob.name} (Copy)`,
      })
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
      await deleteMutation.mutateAsync(deleteConfirmId)
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
      const updated = await updateMutation.mutateAsync({
        id: selectedCronjob.id,
        cronjob: updates,
      })
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
            isSubmitting={createMutation.isPending || updateMutation.isPending}
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
        <div className="flex gap-2">
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity"
            aria-label="Create new cronjob"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden />
            Quick Create
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/cronjob-editor')}
            aria-label="Open advanced cronjob editor"
          >
            Advanced Editor
          </Button>
        </div>
      </div>

      {hasError && (
        <div
          className="flex items-center justify-between rounded-xl border border-warning/30 bg-warning/10 p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" aria-hidden />
            <p className="text-sm text-foreground">Using demo data. Connect to API for live data.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchCronjobs()}
            aria-label="Retry fetching cronjobs from API"
          >
            Retry
          </Button>
        </div>
      )}

      <CronjobList
        cronjobs={cronjobs}
        isLoading={isLoading}
        isError={hasError}
        onSelect={setSelectedCronjob}
        selectedId={selectedCronjob?.id}
        onCreateClick={handleCreate}
        onRetry={() => refetchCronjobs()}
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
              isRunning={runNowMutation.isPending && runNowMutation.variables === selectedCronjob.id}
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
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              aria-label="Cancel delete cronjob"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              aria-label="Confirm delete cronjob"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!runDetail}
        onOpenChange={(open) => {
          if (!open) {
            setRunDetail(null)
            setArtifactUrls([])
          }
        }}
      >
        <DialogContent showClose className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Run Detail & Artifacts</DialogTitle>
            <DialogDescription>
              {runDetail && new Date(runDetail.started_at).toLocaleString()} — {runDetail?.status}
            </DialogDescription>
          </DialogHeader>
          {runDetail && (
            <RunDetailContent
              runDetail={runDetail}
              artifactUrls={artifactUrls}
              artifactUrlsLoading={artifactUrlsLoading}
              onLoadArtifacts={() => {
                setArtifactUrlsLoading(true)
                getRunArtifactUrls(runDetail.id)
                  .then((urls) => setArtifactUrls(urls))
                  .catch(() => setArtifactUrls([]))
                  .finally(() => setArtifactUrlsLoading(false))
              }}
              runId={runDetail.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
