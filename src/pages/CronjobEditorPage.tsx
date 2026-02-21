import { useEffect, useCallback, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronRight, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import {
  NameDescriptionFields,
  ScheduleBuilder,
  TriggerTypeSelector,
  TargetSelector,
  InputPayloadEditor,
  AutomationLevel,
  ConstraintsPanel,
  SafetyRails,
  RetryDeadLetterPolicy,
  SaveEnableRunNowButtons,
} from '@/components/cronjob-editor'
import {
  fetchCronjob,
  createCronjob,
  updateCronjob,
  runCronjobNow,
} from '@/api/cronjobs'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/loading-states'
import type {
  Cronjob,
  AutomationLevel as AutomationLevelType,
  TriggerType,
  RetryPolicy,
  DeadLetterPolicy,
  CronjobConstraints,
} from '@/types/cronjobs'
import type { VariableSchema, NameDescriptionFormValues } from '@/components/cronjob-editor'
import type { UseFormRegister } from 'react-hook-form'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  schedule: z.string().min(1, 'Schedule is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  trigger_type: z.string(),
  target: z.string().min(1, 'Target is required'),
  automation_level: z.string(),
})

type FormValues = z.infer<typeof schema>

function parsePayload(payload: Record<string, unknown> | undefined) {
  const p = payload ?? {}
  return {
    promptTemplate: (p.prompt_template as string) ?? '',
    variableSchema: (p.variable_schema as Record<string, VariableSchema>) ?? {},
    sampleValues: (p.sample_values as Record<string, unknown>) ?? {},
    constraintsPanel: (p.constraints_panel as CronjobConstraints) ?? {},
    safetyRailsConfig: (p.safety_rails_config as {
      confirmations_required?: boolean
      blocked_operations?: string[]
    }) ?? {},
  }
}

function buildPayload(
  promptTemplate: string,
  variableSchema: Record<string, VariableSchema>,
  sampleValues: Record<string, unknown>,
  constraintsPanel: CronjobConstraints,
  safetyRailsConfig: { confirmations_required?: boolean; blocked_operations?: string[] }
): Record<string, unknown> {
  return {
    prompt_template: promptTemplate,
    variable_schema: variableSchema,
    sample_values: sampleValues,
    constraints_panel: constraintsPanel,
    safety_rails_config: safetyRailsConfig,
  }
}

export default function CronjobEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = !!id

  const {
    data: cronjob,
    isLoading,
    isError,
    refetch: _refetch,
  } = useQuery({
    queryKey: ['cronjob', id],
    queryFn: () => fetchCronjob(id!),
    enabled: isEdit,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      schedule: '0 9 * * *',
      timezone: 'UTC',
      trigger_type: 'time',
      target: '',
      automation_level: 'approval_required',
    },
  })

  useEffect(() => {
    if (cronjob) {
      setValue('name', cronjob.name)
      setValue('description', cronjob.description ?? '')
      setValue('schedule', cronjob.schedule)
      setValue('timezone', cronjob.timezone)
      setValue('trigger_type', cronjob.trigger_type)
      setValue('target', cronjob.target)
      setValue('automation_level', cronjob.automation_level)
    }
  }, [cronjob, setValue])

  const payloadData = parsePayload(cronjob?.payload as Record<string, unknown>)
  const [promptTemplate, setPromptTemplate] = useState(payloadData.promptTemplate)
  const [variableSchema, setVariableSchema] = useState(payloadData.variableSchema)
  const [sampleValues, setSampleValues] = useState(payloadData.sampleValues)
  const [constraintsPanel, setConstraintsPanel] = useState<CronjobConstraints>(
    payloadData.constraintsPanel
  )
  const [safetyRailsConfig, setSafetyRailsConfig] = useState(payloadData.safetyRailsConfig)
  const [retryPolicy, setRetryPolicy] = useState<RetryPolicy>(
    cronjob?.retry_policy ?? { max_retries: 3, backoff_ms: 1000 }
  )
  const [deadLetterPolicy, setDeadLetterPolicy] = useState<DeadLetterPolicy>(
    cronjob?.dead_letter_policy ?? {}
  )

  useEffect(() => {
    if (cronjob) {
      const p = parsePayload(cronjob.payload as Record<string, unknown>)
      setPromptTemplate(p.promptTemplate)
      setVariableSchema(p.variableSchema)
      setSampleValues(p.sampleValues)
      setConstraintsPanel(p.constraintsPanel)
      setSafetyRailsConfig(p.safetyRailsConfig)
      setRetryPolicy(cronjob.retry_policy ?? { max_retries: 3, backoff_ms: 1000 })
      setDeadLetterPolicy(cronjob.dead_letter_policy ?? {})
    }
  }, [cronjob?.id, cronjob])

  const createMutation = useMutation({
    mutationFn: (data: Omit<Cronjob, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
      createCronjob(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['cronjobs'] })
      toast.success('Cronjob created')
      navigate(`/dashboard/cronjob-editor/${created.id}`)
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create cronjob')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id: cid, data }: { id: string; data: Partial<Cronjob> }) =>
      updateCronjob(cid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronjob', id] })
      queryClient.invalidateQueries({ queryKey: ['cronjobs'] })
      toast.success('Cronjob updated')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update cronjob')
    },
  })

  const runMutation = useMutation({
    mutationFn: (cid: string) => runCronjobNow(cid),
    onSuccess: () => {
      toast.success('Run triggered')
      queryClient.invalidateQueries({ queryKey: ['cronjob', id] })
    },
    onError: () => {
      toast.error('Failed to trigger run')
    },
  })

  const onSave = handleSubmit((formValues) => {
    const payload = buildPayload(
      promptTemplate,
      variableSchema,
      sampleValues,
      constraintsPanel,
      safetyRailsConfig
    )
    const constraints = Array.isArray(cronjob?.constraints)
      ? cronjob.constraints
      : [
          ...(constraintsPanel.allowed_tools ?? []),
          ...(constraintsPanel.max_actions != null
            ? [`max_actions:${constraintsPanel.max_actions}`]
            : []),
          ...(constraintsPanel.spend_limit != null
            ? [`spend_limit:${constraintsPanel.spend_limit}`]
            : []),
        ]
    const safety_rails = [
      ...(safetyRailsConfig.blocked_operations ?? []),
      ...(cronjob?.safety_rails ?? []).filter(
        (s) => !(safetyRailsConfig.blocked_operations ?? []).includes(s)
      ),
    ]

    const cronjobData = {
      name: formValues.name,
      description: formValues.description,
      schedule: formValues.schedule,
      timezone: formValues.timezone,
      trigger_type: formValues.trigger_type as TriggerType,
      target: formValues.target,
      automation_level: formValues.automation_level as AutomationLevelType,
      payload,
      constraints,
      safety_rails,
      retry_policy: retryPolicy,
      dead_letter_policy: deadLetterPolicy,
      status: cronjob?.status ?? 'active',
    }

    if (isEdit && id) {
      updateMutation.mutate({ id, data: cronjobData })
    } else {
      createMutation.mutate(cronjobData)
    }
  })

  const onEnable = useCallback(() => {
    if (!id || !cronjob) return
    const newStatus = cronjob.status === 'active' ? 'paused' : 'active'
    updateMutation.mutate({ id, data: { status: newStatus } })
  }, [id, cronjob, updateMutation])

  const onRunNow = useCallback(() => {
    if (!id) return
    runMutation.mutate(id)
  }, [id, runMutation])

  const values = watch()
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const isRunning = runMutation.isPending

  if (isEdit && isLoading) {
    return (
      <div className="space-y-8 animate-fade-in" role="status" aria-label="Loading cronjob editor">
        <Skeleton className="h-5 w-64" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 sm:w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
        <span className="sr-only">Loading cronjob editor...</span>
      </div>
    )
  }

  if (isEdit && (isError || (!isLoading && !cronjob))) {
    return (
      <div className="space-y-8 animate-fade-in">
        <ErrorState
          title="Cronjob not found"
          message="The cronjob you're looking for doesn't exist or you don't have access."
          onRetry={() => navigate('/dashboard/cronjobs-dashboard')}
          retryLabel="Back to Cronjobs"
        />
      </div>
    )
  }

  const constraintsObj =
    typeof constraintsPanel === 'object' && constraintsPanel !== null
      ? constraintsPanel
      : {}
  const allowedTools = Array.isArray(constraintsObj.allowed_tools)
    ? constraintsObj.allowed_tools
    : []

  return (
    <div className="space-y-8 animate-fade-in">
      <nav
        className="flex items-center gap-2 text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link
          to="/dashboard"
          className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          aria-label="Go to Dashboard"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <Link
          to="/dashboard/cronjobs-dashboard"
          className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          aria-label="Go to Cronjobs dashboard"
        >
          Cronjobs
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-foreground" aria-current="page">
          {isEdit ? 'Edit' : 'Create'}
        </span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isEdit ? 'Edit Cronjob' : 'Create Cronjob'}
          </h1>
          <p className="text-muted-foreground">
            Fine-grained editor for cronjobs and workflows with prompts, variables, and constraints
          </p>
        </div>
      </div>

      {(createMutation.isError || updateMutation.isError) && (
        <div
          className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" aria-hidden />
            <p className="text-sm text-foreground">
              {createMutation.error instanceof Error
                ? createMutation.error.message
                : updateMutation.error instanceof Error
                  ? updateMutation.error.message
                  : 'An error occurred'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              createMutation.reset()
              updateMutation.reset()
            }}
            className="text-sm text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
            aria-label="Dismiss error message"
          >
            Dismiss
          </button>
        </div>
      )}

      <form
        onSubmit={onSave}
        className="space-y-8"
        aria-label={isEdit ? 'Edit cronjob form' : 'Create cronjob form'}
        noValidate
      >
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="animate-fade-in-up">
              <NameDescriptionFields
                register={register as unknown as UseFormRegister<NameDescriptionFormValues>}
                errors={errors}
              />
            </div>
            <div className="animate-fade-in-up-delay-1">
              <ScheduleBuilder
                schedule={values.schedule}
                timezone={values.timezone}
                onScheduleChange={(v) => setValue('schedule', v)}
                onTimezoneChange={(v) => setValue('timezone', v)}
                error={errors.schedule?.message}
              />
            </div>
            <div className="animate-fade-in-up-delay-2">
              <TriggerTypeSelector
                value={values.trigger_type as TriggerType}
                onChange={(v) => setValue('trigger_type', v)}
              />
            </div>
            <div className="animate-fade-in-up-delay-3">
              <TargetSelector
                value={values.target}
                onChange={(v) => setValue('target', v)}
                error={errors.target?.message}
              />
            </div>
            <div className="animate-fade-in-up-delay-4">
              <InputPayloadEditor
                promptTemplate={promptTemplate}
                onPromptTemplateChange={setPromptTemplate}
                variableSchema={variableSchema}
                onVariableSchemaChange={setVariableSchema}
                sampleValues={sampleValues}
                onSampleValuesChange={setSampleValues}
              />
            </div>
            <div className="animate-fade-in-up">
              <AutomationLevel
                value={values.automation_level as AutomationLevelType}
                onChange={(v) => setValue('automation_level', v)}
              />
            </div>
            <div className="animate-fade-in-up">
              <ConstraintsPanel
                maxActions={constraintsObj.max_actions}
                spendLimit={constraintsObj.spend_limit}
                allowedTools={allowedTools}
                onMaxActionsChange={(v) =>
                  setConstraintsPanel((p) => ({ ...p, max_actions: v }))
                }
                onSpendLimitChange={(v) =>
                  setConstraintsPanel((p) => ({ ...p, spend_limit: v }))
                }
                onAllowedToolsChange={(v) =>
                  setConstraintsPanel((p) => ({ ...p, allowed_tools: v }))
                }
              />
            </div>
            <div className="animate-fade-in-up">
              <SafetyRails
                confirmationsRequired={safetyRailsConfig.confirmations_required ?? false}
                onConfirmationsRequiredChange={(v) =>
                  setSafetyRailsConfig((p) => ({ ...p, confirmations_required: v }))
                }
                blockedOperations={safetyRailsConfig.blocked_operations ?? []}
                onBlockedOperationsChange={(v) =>
                  setSafetyRailsConfig((p) => ({ ...p, blocked_operations: v }))
                }
              />
            </div>
            <div className="animate-fade-in-up">
              <RetryDeadLetterPolicy
                retryPolicy={retryPolicy}
                onRetryPolicyChange={setRetryPolicy}
                deadLetterPolicy={deadLetterPolicy}
                onDeadLetterPolicyChange={setDeadLetterPolicy}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <SaveEnableRunNowButtons
                onEnable={onEnable}
                onRunNow={onRunNow}
                isSubmitting={isSubmitting}
                isEnabling={updateMutation.isPending}
                isRunning={isRunning}
                isEnabled={cronjob?.status === 'active'}
                canRunNow={!!id}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

