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
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const CRON_PRESETS = [
  { value: '0 9 * * *', label: 'Daily at 9:00' },
  { value: '0 0 * * 0', label: 'Weekly on Sunday' },
  { value: '*/30 * * * *', label: 'Every 30 minutes' },
  { value: '0 8 * * 1-5', label: 'Weekdays at 8:00' },
  { value: '0 0 1 * *', label: 'Monthly on 1st' },
  { value: '0 */6 * * *', label: 'Every 6 hours' },
  { value: '*/15 * * * *', label: 'Every 15 minutes' },
]

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'America/Denver',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
]

export interface ScheduleFormValues {
  schedule: string
  timezone: string
}

interface ScheduleBuilderProps {
  schedule: string
  timezone: string
  onScheduleChange: (value: string) => void
  onTimezoneChange: (value: string) => void
  disabled?: boolean
  error?: string
}

export function ScheduleBuilder({
  schedule,
  timezone,
  onScheduleChange,
  onTimezoneChange,
  disabled,
  error,
}: ScheduleBuilderProps) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          <div>
            <CardTitle>Schedule Builder</CardTitle>
            <CardDescription>
              Cron expression, visual builder, and timezone
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="schedule-preset">Preset</Label>
          <Select value={schedule} onValueChange={onScheduleChange} disabled={disabled}>
            <SelectTrigger id="schedule-preset" className="transition-all duration-200">
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              {CRON_PRESETS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    ({p.value})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="schedule-cron">Cron Expression</Label>
          <Input
            id="schedule-cron"
            value={schedule}
            onChange={(e) => onScheduleChange(e.target.value)}
            placeholder="0 9 * * *"
            className={cn(
              'font-mono text-sm transition-all duration-200 focus:border-accent/50',
              error && 'border-red-500/50'
            )}
            disabled={disabled}
          />
          {error && (
            <p className="text-sm text-red-400 animate-fade-in">{error}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={timezone} onValueChange={onTimezoneChange} disabled={disabled}>
            <SelectTrigger id="timezone" className="transition-all duration-200">
              <SelectValue placeholder="Select timezone" />
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
  )
}
