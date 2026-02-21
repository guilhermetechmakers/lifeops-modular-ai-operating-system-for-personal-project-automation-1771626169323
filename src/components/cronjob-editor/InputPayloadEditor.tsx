import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, FileCode } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface VariableSchema {
  type: string
  sample?: unknown
}

export interface PayloadFormValues {
  prompt_template: string
  variable_schema: Record<string, VariableSchema>
  sample_values: Record<string, unknown>
}

interface InputPayloadEditorProps {
  promptTemplate: string
  onPromptTemplateChange: (value: string) => void
  variableSchema: Record<string, VariableSchema>
  onVariableSchemaChange: (value: Record<string, VariableSchema>) => void
  sampleValues: Record<string, unknown>
  onSampleValuesChange: (value: Record<string, unknown>) => void
  disabled?: boolean
}

const VARIABLE_TYPES = ['string', 'number', 'boolean', 'object', 'array']

export function InputPayloadEditor({
  promptTemplate,
  onPromptTemplateChange,
  variableSchema,
  onVariableSchemaChange,
  sampleValues,
  onSampleValuesChange,
  disabled,
}: InputPayloadEditorProps) {
  const [newVarKey, setNewVarKey] = useState('')
  const [newVarType, setNewVarType] = useState('string')

  const addVariable = () => {
    const key = newVarKey.trim().replace(/^{{|}}$/g, '')
    if (!key) return
    const varKey = key.startsWith('{{') ? key : `{{${key}}}`
    onVariableSchemaChange({
      ...variableSchema,
      [varKey]: { type: newVarType, sample: '' },
    })
    onSampleValuesChange({ ...sampleValues, [varKey]: '' })
    setNewVarKey('')
  }

  const removeVariable = (key: string) => {
    const next = { ...variableSchema }
    delete next[key]
    onVariableSchemaChange(next)
    const nextSamples = { ...sampleValues }
    delete nextSamples[key]
    onSampleValuesChange(nextSamples)
  }

  const updateSchema = (key: string, field: 'type' | 'sample', value: unknown) => {
    const current = variableSchema[key] ?? { type: 'string', sample: '' }
    if (field === 'type') {
      onVariableSchemaChange({ ...variableSchema, [key]: { ...current, type: value as string } })
    } else {
      onVariableSchemaChange({ ...variableSchema, [key]: { ...current, sample: value } })
    }
  }

  const updateSample = (key: string, value: unknown) => {
    onSampleValuesChange({ ...sampleValues, [key]: value })
  }

  return (
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileCode className="h-5 w-5 text-accent" />
          <div>
            <CardTitle>Input Payload Editor</CardTitle>
            <CardDescription>
              Prompt template with variable schema and sample values
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt-template">Prompt Template</Label>
          <textarea
            id="prompt-template"
            value={promptTemplate}
            onChange={(e) => onPromptTemplateChange(e.target.value)}
            placeholder="e.g. Summarize the content for {{topic}} with focus on {{aspect}}"
            aria-label="Prompt template"
            className={cn(
              'flex min-h-[120px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm font-mono text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200'
            )}
            disabled={disabled}
            spellCheck={false}
          />
        </div>

        <div className="space-y-4">
          <Label>Variable Schema</Label>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Variable name (e.g. topic)"
              value={newVarKey}
              onChange={(e) => setNewVarKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addVariable()}
              className="w-40"
              disabled={disabled}
              aria-label="Variable name"
            />
            <select
              value={newVarType}
              onChange={(e) => setNewVarType(e.target.value)}
              className="rounded-lg border border-border bg-input px-3 py-2 text-sm"
              disabled={disabled}
            >
              {VARIABLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariable}
              disabled={disabled || !newVarKey.trim()}
              aria-label="Add variable"
            >
              <Plus className="h-4 w-4 mr-1" aria-hidden />
              Add
            </Button>
          </div>

          {Object.entries(variableSchema).length > 0 && (
            <div className="space-y-2 rounded-lg border border-border p-4">
              {Object.entries(variableSchema).map(([key, schema]) => (
                <div
                  key={key}
                  className="flex flex-wrap items-center gap-2 py-2 border-b border-border last:border-0"
                >
                  <span className="font-mono text-sm text-accent">{key}</span>
                  <select
                    value={schema.type}
                    onChange={(e) => updateSchema(key, 'type', e.target.value)}
                    className="rounded border border-border bg-input px-2 py-1 text-xs"
                    disabled={disabled}
                  >
                    {VARIABLE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="Sample value"
                    value={String(sampleValues[key] ?? '')}
                    onChange={(e) => updateSample(key, e.target.value)}
                    className="w-32 text-xs"
                    disabled={disabled}
                  />
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeVariable(key)}
                      aria-label={`Remove variable ${key}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
