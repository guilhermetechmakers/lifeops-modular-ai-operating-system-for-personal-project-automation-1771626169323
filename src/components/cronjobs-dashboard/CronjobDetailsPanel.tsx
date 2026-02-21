import { useState, useEffect } from 'react'
import { CalendarClock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, ErrorState } from '@/components/ui/loading-states'
import type { Cronjob, CronjobConstraints } from '@/types/cronjobs'
import { cn } from '@/lib/utils'

function getConstraintsArray(constraints: string[] | CronjobConstraints | undefined): string[] {
  if (!constraints) return []
  if (Array.isArray(constraints)) return constraints
  return constraints.allowed_tools ?? []
}

interface CronjobDetailsPanelProps {
  cronjob: Cronjob | null
  isLoading?: boolean
  error?: string | null
  onUpdate?: (updates: Partial<Cronjob>) => void
  onRetry?: () => void
  readOnly?: boolean
}

const CRON_PRESETS = [
  { value: '0 9 * * *', label: 'Daily at 9:00' },
  { value: '0 0 * * 0', label: 'Weekly on Sunday' },
  { value: '*/30 * * * *', label: 'Every 30 minutes' },
  { value: '0 8 * * 1-5', label: 'Weekdays at 8:00' },
  { value: '0 0 1 * *', label: 'Monthly on 1st' },
]

const TIMEZONES = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo']

function PayloadEditor({
  value,
  onChange,
  disabled,
}: {
  value: Record<string, unknown>
  onChange: (v: Record<string, unknown>) => void
  disabled?: boolean
}) {
  const valueStr = JSON.stringify(value, null, 2)
  const [local, setLocal] = useState(valueStr)
  useEffect(() => {
    setLocal(valueStr)
  }, [valueStr])

  const handleBlur = () => {
    try {
      const parsed = JSON.parse(local || '{}') as Record<string, unknown>
      onChange(parsed)
    } catch {
      setLocal(JSON.stringify(value, null, 2))
    }
  }

  return (
    <textarea
      aria-label="JSON payload for the cronjob"
      className={cn(
        'flex min-h-[120px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm font-mono text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50'
      )}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={handleBlur}
      disabled={disabled}
      spellCheck={false}
    />
  )
}

export function CronjobDetailsPanel({
  cronjob,
  isLoading,
  error,
  onUpdate,
  onRetry,
  readOnly,
}: CronjobDetailsPanelProps) {
  if (error) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <ErrorState
            title="Failed to load cronjob details"
            message={error}
            onRetry={onRetry}
            retryLabel="Try again"
          />
        </CardContent>
      </Card>
    )
  }

  if (!cronjob && !isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <EmptyState
            icon={CalendarClock}
            heading="No cronjob selected"
            description="Select a cronjob from the list to view and edit its schedule, triggers, payload, constraints, and retry policy."
          />
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  const c = cronjob!
  const constraintsArray = getConstraintsArray(c.constraints)
  return (
    <div className="space-y-6">
      <Card className="transition-shadow duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Schedule Builder</CardTitle>
          <CardDescription>Cron expression and timezone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="schedule">Cron Expression</Label>
            <Select
              value={c.schedule}
              onValueChange={(v) => onUpdate?.({ schedule: v })}
              disabled={readOnly}
            >
              <SelectTrigger id="schedule" aria-label="Schedule preset">
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                {CRON_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label} ({p.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="schedule-custom"
              aria-label="Custom cron expression"
              className="mt-2 font-mono text-xs"
              value={c.schedule}
              onChange={(e) => onUpdate?.({ schedule: e.target.value })}
              placeholder="0 9 * * *"
              disabled={readOnly}
            />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={c.timezone}
              onValueChange={(v) => onUpdate?.({ timezone: v })}
              disabled={readOnly}
            >
              <SelectTrigger id="timezone" aria-label="Timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-shadow duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Trigger & Target</CardTitle>
          <CardDescription>Trigger type and target agent/workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="trigger">Trigger Type</Label>
            <Select
              value={c.trigger_type}
              onValueChange={(v) => onUpdate?.({ trigger_type: v as Cronjob['trigger_type'] })}
              disabled={readOnly}
            >
              <SelectTrigger id="trigger" aria-label="Trigger type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cron">Cron</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              aria-label="Target agent or workflow ID"
              value={c.target}
              onChange={(e) => onUpdate?.({ target: e.target.value })}
              placeholder="agent-id or workflow-id"
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="transition-shadow duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Payload Editor</CardTitle>
          <CardDescription>JSON payload for the cronjob</CardDescription>
        </CardHeader>
        <CardContent>
          <PayloadEditor
            value={c.payload ?? {}}
            onChange={(p) => onUpdate?.({ payload: p })}
            disabled={readOnly}
          />
        </CardContent>
      </Card>

      <Card className="transition-shadow duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Constraints & Safety Rails</CardTitle>
          <CardDescription>Constraints and safety rails for execution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Constraints</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {constraintsArray.map((constraint: string, i: number) => (
                <Badge key={i} variant="outline" className="gap-1">
                  {constraint}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdate?.({
                          constraints: constraintsArray.filter((_: string, j: number) => j !== i),
                        })
                      }
                      className="ml-1 rounded hover:bg-secondary"
                      aria-label={`Remove ${constraint}`}
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
              {constraintsArray.length === 0 && (
                <span className="text-sm text-muted-foreground">None</span>
              )}
              {!readOnly && (
                <Input
                  id="add-constraint"
                  aria-label="Add constraint"
                  placeholder="Add constraint..."
                  className="h-8 w-36 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget
                      const val = input.value.trim()
                      if (val) {
                        onUpdate?.({
                          constraints: [...constraintsArray, val],
                        })
                        input.value = ''
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
          <div>
            <Label>Safety Rails</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(c.safety_rails ?? []).map((s, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {s}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdate?.({
                          safety_rails: (c.safety_rails ?? []).filter((_, j) => j !== i),
                        })
                      }
                      className="ml-1 rounded hover:bg-secondary"
                      aria-label={`Remove ${s}`}
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
              {(!c.safety_rails || c.safety_rails.length === 0) && (
                <span className="text-sm text-muted-foreground">None</span>
              )}
              {!readOnly && (
                <Input
                  id="add-safety-rail"
                  aria-label="Add safety rail"
                  placeholder="Add safety rail..."
                  className="h-8 w-36 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget
                      const val = input.value.trim()
                      if (val) {
                        onUpdate?.({
                          safety_rails: [...(c.safety_rails ?? []), val],
                        })
                        input.value = ''
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-shadow duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Retry Policy</CardTitle>
          <CardDescription>Max retries and backoff</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="max-retries">Max Retries</Label>
              <Input
                id="max-retries"
                aria-label="Maximum number of retries"
                type="number"
                min={0}
                value={c.retry_policy?.max_retries ?? 3}
                onChange={(e) =>
                  onUpdate?.({
                    retry_policy: {
                      ...c.retry_policy,
                      max_retries: parseInt(e.target.value, 10) || 0,
                      backoff_ms: c.retry_policy?.backoff_ms ?? 1000,
                    },
                  })
                }
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="backoff-ms">Backoff (ms)</Label>
              <Input
                id="backoff-ms"
                aria-label="Backoff delay in milliseconds"
                type="number"
                min={0}
                value={c.retry_policy?.backoff_ms ?? 1000}
                onChange={(e) =>
                  onUpdate?.({
                    retry_policy: {
                      ...c.retry_policy,
                      max_retries: c.retry_policy?.max_retries ?? 3,
                      backoff_ms: parseInt(e.target.value, 10) || 0,
                    },
                  })
                }
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
