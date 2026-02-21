import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AutomationLevel as AutomationLevelType } from '@/types/cronjobs'

const AUTOMATION_OPTIONS: {
  value: AutomationLevelType
  label: string
  description: string
}[] = [
  {
    value: 'suggest_only',
    label: 'Suggest Only',
    description: 'AI suggests actions; user approves all',
  },
  {
    value: 'approval_required',
    label: 'Approval Required',
    description: 'Requires explicit approval before execution',
  },
  {
    value: 'conditional_auto_execute',
    label: 'Conditional Auto-Execute',
    description: 'Auto-execute when conditions are met',
  },
  {
    value: 'bounded_autopilot',
    label: 'Bounded Autopilot',
    description: 'Full automation within defined bounds',
  },
  { value: 'manual', label: 'Manual (legacy)', description: 'Manual execution only' },
  { value: 'assisted', label: 'Assisted (legacy)', description: 'Assisted with recommendations' },
  { value: 'full', label: 'Full (legacy)', description: 'Full automation, no approval' },
]

interface AutomationLevelProps {
  value: AutomationLevelType
  onChange: (value: AutomationLevelType) => void
  disabled?: boolean
  error?: string
}

export function AutomationLevel({ value, onChange, disabled, error }: AutomationLevelProps) {
  const selected = AUTOMATION_OPTIONS.find((o) => o.value === value)

  return (
    <Card
      className="transition-shadow duration-300 hover:shadow-card"
      aria-labelledby="automation-level-heading"
      aria-describedby="automation-level-description"
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 shrink-0 text-accent" aria-hidden />
          <div className="min-w-0 flex-1">
            <h2
              id="automation-level-heading"
              className="text-lg font-semibold leading-none tracking-tight text-foreground"
            >
              Automation Level
            </h2>
            <CardDescription id="automation-level-description">
              suggest-only / approval-required / conditional auto-execute / bounded autopilot
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="automation-level">Level</Label>
          <Select
            value={value}
            onValueChange={(v) => onChange(v as AutomationLevelType)}
            disabled={disabled}
          >
            <SelectTrigger
              id="automation-level"
              className={cn(
                'transition-all duration-200',
                error && 'border-destructive focus:ring-destructive'
              )}
              aria-invalid={!!error}
              aria-describedby={error ? 'automation-level-error' : undefined}
            >
              <SelectValue placeholder="Select automation level">
                {selected ? (
                  <div className="flex flex-col">
                    <span>{selected.label}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {selected.description}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select automation level</span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AUTOMATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex flex-col">
                    <span>{opt.label}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {opt.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <div
              id="automation-level-error"
              className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
