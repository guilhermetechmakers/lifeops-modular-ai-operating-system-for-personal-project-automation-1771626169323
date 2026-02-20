import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronRight, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Cronjob } from '@/types/cronjobs'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  schedule: z.string().min(1, 'Schedule is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  target: z.string().min(1, 'Target is required'),
  automation_level: z.enum(['full', 'assisted', 'manual']),
  trigger_type: z.enum(['cron', 'manual', 'webhook']),
})

type FormData = z.infer<typeof schema>

const STEPS = [
  { id: 'basics', title: 'Basics', description: 'Name and description' },
  { id: 'schedule', title: 'Schedule', description: 'When to run' },
  { id: 'target', title: 'Target', description: 'Agent or workflow' },
  { id: 'review', title: 'Review', description: 'Confirm and create' },
]

interface CreateEditWizardProps {
  initialData?: Partial<Cronjob> | null
  onSubmit: (data: Omit<Cronjob, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function CreateEditWizard({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: CreateEditWizardProps) {
  const [step, setStep] = useState(0)
  const isEdit = !!initialData?.id

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      schedule: initialData?.schedule ?? '0 9 * * *',
      timezone: initialData?.timezone ?? 'UTC',
      target: initialData?.target ?? '',
      automation_level: (initialData?.automation_level as FormData['automation_level']) ?? 'assisted',
      trigger_type: (initialData?.trigger_type as FormData['trigger_type']) ?? 'cron',
    },
  })

  const values = watch()

  const onFormSubmit = () => {
    onSubmit({
      name: values.name,
      description: values.description,
      schedule: values.schedule,
      timezone: values.timezone,
      target: values.target,
      automation_level: values.automation_level,
      trigger_type: values.trigger_type,
      status: initialData?.status ?? 'active',
      payload: initialData?.payload ?? {},
      constraints: initialData?.constraints ?? [],
      safety_rails: initialData?.safety_rails ?? [],
      retry_policy: initialData?.retry_policy ?? { max_retries: 3, backoff_ms: 1000 },
    })
  }

  const canProceed = () => {
    if (step === 0) return !!values.name
    if (step === 1) return !!values.schedule && !!values.timezone
    if (step === 2) return !!values.target
    return true
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200',
                  step >= i
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-muted-foreground',
                  step === i && 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                )}
              >
                {step > i ? <Check className="h-4 w-4" /> : i + 1}
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
        <CardTitle>{STEPS[step].title}</CardTitle>
        <CardDescription>{STEPS[step].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Daily Content Sync"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  {...register('description')}
                  placeholder="Sync content from external sources"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="schedule">Cron Expression</Label>
                <Select
                  value={values.schedule}
                  onValueChange={(v) => setValue('schedule', v)}
                >
                  <SelectTrigger id="schedule" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0 9 * * *">Daily at 9:00</SelectItem>
                    <SelectItem value="0 0 * * 0">Weekly on Sunday</SelectItem>
                    <SelectItem value="*/30 * * * *">Every 30 minutes</SelectItem>
                    <SelectItem value="0 8 * * 1-5">Weekdays at 8:00</SelectItem>
                    <SelectItem value="0 0 1 * *">Monthly on 1st</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  {...register('schedule')}
                  className="mt-2 font-mono text-xs"
                  placeholder="0 9 * * *"
                />
                {errors.schedule && (
                  <p className="text-sm text-red-400 mt-1">{errors.schedule.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={values.timezone}
                  onValueChange={(v) => setValue('timezone', v)}
                >
                  <SelectTrigger id="timezone" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.timezone && (
                  <p className="text-sm text-red-400 mt-1">{errors.timezone.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="target">Target (Agent or Workflow ID)</Label>
                <Input
                  id="target"
                  {...register('target')}
                  placeholder="content-sync-agent"
                  className="mt-1"
                />
                {errors.target && (
                  <p className="text-sm text-red-400 mt-1">{errors.target.message}</p>
                )}
              </div>
              <div>
                <Label>Automation Level</Label>
                <Select
                  value={values.automation_level}
                  onValueChange={(v) => setValue('automation_level', v as FormData['automation_level'])}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full (no approval)</SelectItem>
                    <SelectItem value="assisted">Assisted (review recommended)</SelectItem>
                    <SelectItem value="manual">Manual (approval required)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Trigger Type</Label>
                <Select
                  value={values.trigger_type}
                  onValueChange={(v) => setValue('trigger_type', v as FormData['trigger_type'])}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cron">Cron</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="rounded-lg border border-border p-4 space-y-2">
                <p><span className="text-muted-foreground">Name:</span> {values.name}</p>
                <p><span className="text-muted-foreground">Schedule:</span> <code className="text-xs bg-secondary px-2 py-1 rounded">{values.schedule}</code></p>
                <p><span className="text-muted-foreground">Timezone:</span> {values.timezone}</p>
                <p><span className="text-muted-foreground">Target:</span> {values.target}</p>
                <p><span className="text-muted-foreground">Automation:</span> {values.automation_level}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEdit ? 'Save' : 'Create'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
