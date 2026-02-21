import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RotateCcw } from 'lucide-react'
import type { RetryPolicy, DeadLetterPolicy } from '@/types/cronjobs'

interface RetryDeadLetterPolicyProps {
  retryPolicy: RetryPolicy
  onRetryPolicyChange: (value: RetryPolicy) => void
  deadLetterPolicy: DeadLetterPolicy
  onDeadLetterPolicyChange: (value: DeadLetterPolicy) => void
  disabled?: boolean
}

export function RetryDeadLetterPolicy({
  retryPolicy,
  onRetryPolicyChange,
  deadLetterPolicy,
  onDeadLetterPolicyChange,
  disabled,
}: RetryDeadLetterPolicyProps) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-accent" />
          <div>
            <CardTitle>Retry & Dead-Letter Policy</CardTitle>
            <CardDescription>
              Retry configuration and dead-letter queue settings
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Retry Policy</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max-retries">Max Retries</Label>
              <Input
                id="max-retries"
                type="number"
                min={0}
                value={retryPolicy.max_retries}
                onChange={(e) =>
                  onRetryPolicyChange({
                    ...retryPolicy,
                    max_retries: Math.max(0, parseInt(e.target.value, 10) || 0),
                  })
                }
                className="transition-all duration-200"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backoff-ms">Backoff (ms)</Label>
              <Input
                id="backoff-ms"
                type="number"
                min={0}
                value={retryPolicy.backoff_ms}
                onChange={(e) =>
                  onRetryPolicyChange({
                    ...retryPolicy,
                    backoff_ms: Math.max(0, parseInt(e.target.value, 10) || 0),
                  })
                }
                className="transition-all duration-200"
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <h4 className="text-sm font-medium">Dead-Letter Policy</h4>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dlq-enabled">Enable Dead-Letter</Label>
              <p className="text-sm text-muted-foreground">
                Send failed runs to dead-letter queue after max retries
              </p>
            </div>
            <Switch
              id="dlq-enabled"
              checked={deadLetterPolicy.enabled ?? false}
              onCheckedChange={(v) =>
                onDeadLetterPolicyChange({ ...deadLetterPolicy, enabled: v })
              }
              disabled={disabled}
            />
          </div>
          {deadLetterPolicy.enabled && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dlq-max-retries">Retries Before DLQ</Label>
                <Input
                  id="dlq-max-retries"
                  type="number"
                  min={0}
                  value={deadLetterPolicy.max_retries_before_dlq ?? retryPolicy.max_retries}
                  onChange={(e) =>
                    onDeadLetterPolicyChange({
                      ...deadLetterPolicy,
                      max_retries_before_dlq: Math.max(
                        0,
                        parseInt(e.target.value, 10) || 0
                      ),
                    })
                  }
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dlq-target">DLQ Target</Label>
                <Input
                  id="dlq-target"
                  value={deadLetterPolicy.dlq_target ?? ''}
                  onChange={(e) =>
                    onDeadLetterPolicyChange({
                      ...deadLetterPolicy,
                      dlq_target: e.target.value,
                    })
                  }
                  placeholder="e.g. dlq-cronjob-failures"
                  disabled={disabled}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
