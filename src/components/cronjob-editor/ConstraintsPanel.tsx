import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConstraintsPanelProps {
  maxActions?: number
  spendLimit?: number
  allowedTools: string[]
  onMaxActionsChange: (value: number) => void
  onSpendLimitChange: (value: number) => void
  onAllowedToolsChange: (value: string[]) => void
  disabled?: boolean
}

export function ConstraintsPanel({
  maxActions,
  spendLimit,
  allowedTools,
  onMaxActionsChange,
  onSpendLimitChange,
  onAllowedToolsChange,
  disabled,
}: ConstraintsPanelProps) {
  const [newTool, setNewTool] = useState('')

  const addTool = () => {
    const t = newTool.trim()
    if (!t || allowedTools.includes(t)) return
    onAllowedToolsChange([...allowedTools, t])
    setNewTool('')
  }

  const removeTool = (idx: number) => {
    onAllowedToolsChange(allowedTools.filter((_, i) => i !== idx))
  }

  return (
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          <div>
            <CardTitle>Constraints Panel</CardTitle>
            <CardDescription>
              Max actions, spend limits, and allowed tools
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="max-actions">Max Actions</Label>
            <Input
              id="max-actions"
              type="number"
              min={0}
              value={maxActions ?? ''}
              onChange={(e) =>
                onMaxActionsChange(Math.max(0, parseInt(e.target.value, 10) || 0))
              }
              placeholder="Unlimited"
              className="transition-all duration-200"
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spend-limit">Spend Limit ($)</Label>
            <Input
              id="spend-limit"
              type="number"
              min={0}
              step={0.01}
              value={spendLimit ?? ''}
              onChange={(e) =>
                onSpendLimitChange(Math.max(0, parseFloat(e.target.value) || 0))
              }
              placeholder="No limit"
              className="transition-all duration-200"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Allowed Tools</Label>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Add tool (e.g. search, write)"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTool()}
              className="w-48"
              disabled={disabled}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTool}
              disabled={disabled || !newTool.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {allowedTools.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {allowedTools.map((tool, i) => (
                <span
                  key={`${tool}-${i}`}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/50 px-3 py-1 text-sm',
                    !disabled && 'group'
                  )}
                >
                  {tool}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => removeTool(i)}
                      className="rounded hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove ${tool}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
