import { useState, useEffect } from 'react'
import { FileText, AlertCircle, CheckCircle, Clock, Loader2, Play, MessageSquare, GitCompare, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchCronjobRuns } from '@/api/cronjobs'
import type { CronjobRun } from '@/types/cronjobs'
import { cn } from '@/lib/utils'

interface RunHistoryTabProps {
  cronjobId: string | null
  onRunDetail?: (run: CronjobRun) => void
  onRunNow?: () => void
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString()
}

export function RunHistoryTab({ cronjobId, onRunDetail, onRunNow }: RunHistoryTabProps) {
  const [runs, setRuns] = useState<CronjobRun[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [activeTab, setActiveTab] = useState('logs')

  const loadRuns = () => {
    if (!cronjobId) return
    setHasError(false)
    setIsLoading(true)
    fetchCronjobRuns(cronjobId)
      .then((data) => {
        setRuns(data)
      })
      .catch(() => {
        setRuns([])
        setHasError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (!cronjobId) {
      setRuns([])
      setHasError(false)
      return
    }
    loadRuns()
  }, [cronjobId])

  if (!cronjobId) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-secondary/50 p-4 mb-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-center">Select a cronjob to view run history</p>
        </CardContent>
      </Card>
    )
  }

  const StatusIcon = ({ status }: { status: CronjobRun['status'] }) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-accent-green" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-accent" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 animate-pulse" />
          <Skeleton className="mt-2 h-4 w-64 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (hasError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-red-500/10 p-4 mb-4">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Failed to load run history</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            There was a problem loading the run history. Please try again.
          </p>
          <Button variant="outline" onClick={loadRuns} className="mt-6">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const failedRuns = runs.filter((r) => r.status === 'failed' && r.error)

  return (
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <CardTitle>Run History</CardTitle>
        <CardDescription>
          Per-run logs, inter-agent message trace, diffs, artifacts, errors
        </CardDescription>
      </CardHeader>
      <CardContent>
        {runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-secondary/50 p-4 mb-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No runs yet</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Run this cronjob to see execution history, logs, and artifacts.
            </p>
            {onRunNow && (
              <Button onClick={onRunNow} className="mt-6 bg-gradient-to-r from-accent to-primary hover:opacity-90">
                <Play className="mr-2 h-4 w-4" />
                Run Now
              </Button>
            )}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="trace">
                <MessageSquare className="mr-1.5 h-4 w-4" />
                Message Trace
              </TabsTrigger>
              <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
              <TabsTrigger value="diffs">
                <GitCompare className="mr-1.5 h-4 w-4" />
                Diffs
              </TabsTrigger>
              {failedRuns.length > 0 && (
                <TabsTrigger value="errors">
                  <AlertTriangle className="mr-1.5 h-4 w-4" />
                  Errors ({failedRuns.length})
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="logs" className="mt-0">
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {runs.map((run) => (
                  <div
                    key={run.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onRunDetail?.(run)}
                    onKeyDown={(e) => e.key === 'Enter' && onRunDetail?.(run)}
                    className={cn(
                      'flex items-center justify-between rounded-xl border border-border p-4 transition-all duration-200',
                      'hover:bg-secondary/30 hover:shadow-md cursor-pointer'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon status={run.status} />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Run {formatDate(run.started_at)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {run.started_at}
                          {run.completed_at && ` → ${run.completed_at}`}
                        </p>
                        {run.logs && (
                          <pre className="mt-2 text-xs text-muted-foreground line-clamp-2 font-mono">
                            {run.logs}
                          </pre>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          run.status === 'success'
                            ? 'success'
                            : run.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {run.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="trace" className="mt-0">
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {runs.map((run) => (
                  <div
                    key={run.id}
                    className="rounded-xl border border-border p-4 transition-all duration-200 hover:bg-secondary/20"
                  >
                    <p className="text-sm font-medium text-foreground mb-2">
                      Run {formatDate(run.started_at)} — Inter-agent message trace
                    </p>
                    <pre className="text-xs bg-secondary rounded-lg p-3 overflow-x-auto font-mono text-muted-foreground">
                      {run.logs || 'No message trace recorded for this run.'}
                    </pre>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="artifacts" className="mt-0">
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {runs
                  .filter((r) => r.artifacts && Object.keys(r.artifacts).length > 0)
                  .map((run) => (
                    <div
                      key={run.id}
                      className="rounded-xl border border-border p-4 transition-all duration-200 hover:bg-secondary/20"
                    >
                      <p className="text-sm font-medium text-foreground mb-2">
                        Run {formatDate(run.started_at)}
                      </p>
                      <pre className="text-xs bg-secondary rounded-lg p-3 overflow-x-auto font-mono">
                        {JSON.stringify(run.artifacts, null, 2)}
                      </pre>
                    </div>
                  ))}
                {runs.every((r) => !r.artifacts || Object.keys(r.artifacts).length === 0) && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm text-muted-foreground">No artifacts recorded</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="diffs" className="mt-0">
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {runs.map((run) => (
                  <div
                    key={run.id}
                    className="rounded-xl border border-border p-4 transition-all duration-200 hover:bg-secondary/20"
                  >
                    <p className="text-sm font-medium text-foreground mb-2">
                      Run {formatDate(run.started_at)} — Diffs
                    </p>
                    <pre className="text-xs bg-secondary rounded-lg p-3 overflow-x-auto font-mono text-muted-foreground">
                      {(run.artifacts as { diff?: string })?.diff || 'No diffs recorded for this run.'}
                    </pre>
                  </div>
                ))}
              </div>
            </TabsContent>
            {failedRuns.length > 0 && (
              <TabsContent value="errors" className="mt-0">
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {failedRuns.map((run) => (
                    <div
                      key={run.id}
                      className="rounded-xl border border-red-500/30 bg-red-500/5 p-4"
                    >
                      <p className="text-sm font-medium text-foreground mb-2">
                        Run {formatDate(run.started_at)}
                      </p>
                      <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap">
                        {run.error || 'Unknown error'}
                      </pre>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
