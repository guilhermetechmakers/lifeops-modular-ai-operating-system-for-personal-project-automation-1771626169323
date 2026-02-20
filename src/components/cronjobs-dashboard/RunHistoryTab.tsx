import { useState, useEffect } from 'react'
import { FileText, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react'
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

export function RunHistoryTab({ cronjobId, onRunDetail }: RunHistoryTabProps) {
  const [runs, setRuns] = useState<CronjobRun[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('logs')

  useEffect(() => {
    if (!cronjobId) {
      setRuns([])
      return
    }
    let cancelled = false
    setIsLoading(true)
    fetchCronjobRuns(cronjobId)
      .then((data) => {
        if (!cancelled) setRuns(data)
      })
      .catch(() => {
        if (!cancelled) setRuns([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [cronjobId])

  if (!cronjobId) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
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
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run History</CardTitle>
        <CardDescription>Per-run logs, inter-agent message trace, diffs, artifacts, errors</CardDescription>
      </CardHeader>
      <CardContent>
        {runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-medium text-foreground">No runs yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Run this cronjob to see execution history
            </p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
            </TabsList>
            <TabsContent value="logs">
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {runs.map((run) => (
                  <div
                    key={run.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border border-border p-4 transition-all duration-200',
                      'hover:bg-secondary/30 hover:shadow-md cursor-pointer'
                    )}
                    onClick={() => onRunDetail?.(run)}
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
            <TabsContent value="artifacts">
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {runs
                  .filter((r) => r.artifacts && Object.keys(r.artifacts).length > 0)
                  .map((run) => (
                    <div
                      key={run.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <p className="text-sm font-medium text-foreground mb-2">
                        Run {formatDate(run.started_at)}
                      </p>
                      <pre className="text-xs bg-secondary rounded p-3 overflow-x-auto">
                        {JSON.stringify(run.artifacts, null, 2)}
                      </pre>
                    </div>
                  ))}
                {runs.every((r) => !r.artifacts || Object.keys(r.artifacts).length === 0) && (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No artifacts recorded
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
