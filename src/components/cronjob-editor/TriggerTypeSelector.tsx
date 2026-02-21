import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Zap } from 'lucide-react'
import type { TriggerType } from '@/types/cronjobs'

const TRIGGER_OPTIONS: { value: TriggerType; label: string; description: string }[] = [
  { value: 'time', label: 'Time', description: 'Run on a schedule (cron)' },
  { value: 'event', label: 'Event', description: 'Triggered by webhook or external event' },
  { value: 'conditional', label: 'Conditional', description: 'Run when conditions are met' },
  { value: 'cron', label: 'Cron (legacy)', description: 'Classic cron schedule' },
  { value: 'manual', label: 'Manual', description: 'Run only when manually triggered' },
  { value: 'webhook', label: 'Webhook (legacy)', description: 'Triggered by HTTP webhook' },
]

interface TriggerTypeSelectorProps {
  value: TriggerType
  onChange: (value: TriggerType) => void
  disabled?: boolean
}

export function TriggerTypeSelector({
  value,
  onChange,
  disabled,
}: TriggerTypeSelectorProps) {
  const displayValue = TRIGGER_OPTIONS.find((o) => o.value === value)?.value ?? value

  return (
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          <div>
            <CardTitle>Trigger Type</CardTitle>
            <CardDescription>
              Time-based, event-driven, or conditional execution
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="trigger-type">Trigger</Label>
          <Select
            value={displayValue}
            onValueChange={(v) => onChange(v as TriggerType)}
            disabled={disabled}
          >
            <SelectTrigger id="trigger-type" className="transition-all duration-200">
              <SelectValue placeholder="Select trigger type" />
            </SelectTrigger>
            <SelectContent>
              {TRIGGER_OPTIONS.map((opt) => (
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
        </div>
      </CardContent>
    </Card>
  )
}
