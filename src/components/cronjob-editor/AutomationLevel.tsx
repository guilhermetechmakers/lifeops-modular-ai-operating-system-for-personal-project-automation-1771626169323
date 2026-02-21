import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Gauge } from 'lucide-react'
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
}

export function AutomationLevel({ value, onChange, disabled }: AutomationLevelProps) {
  const selected = AUTOMATION_OPTIONS.find((o) => o.value === value)

  return (
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-accent" />
          <div>
            <CardTitle>Automation Level</CardTitle>
            <CardDescription>
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
            <SelectTrigger id="automation-level" className="transition-all duration-200">
              <SelectValue placeholder="Select automation level">
                {selected && (
                  <div className="flex flex-col">
                    <span>{selected.label}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {selected.description}
                    </span>
                  </div>
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
        </div>
      </CardContent>
    </Card>
  )
}
