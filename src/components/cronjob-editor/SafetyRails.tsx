import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SafetyRailsProps {
  confirmationsRequired: boolean
  onConfirmationsRequiredChange: (value: boolean) => void
  blockedOperations: string[]
  onBlockedOperationsChange: (value: string[]) => void
  disabled?: boolean
}

export function SafetyRails({
  confirmationsRequired,
  onConfirmationsRequiredChange,
  blockedOperations,
  onBlockedOperationsChange,
  disabled,
}: SafetyRailsProps) {
  const [newBlocked, setNewBlocked] = useState('')

  const addBlocked = () => {
    const v = newBlocked.trim()
    if (!v || blockedOperations.includes(v)) return
    onBlockedOperationsChange([...blockedOperations, v])
    setNewBlocked('')
  }

  const removeBlocked = (idx: number) => {
    onBlockedOperationsChange(blockedOperations.filter((_, i) => i !== idx))
  }

  return (
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-accent" />
          <div>
            <CardTitle>Safety Rails</CardTitle>
            <CardDescription>
              Confirmations required and blocked operations list
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <Label htmlFor="confirmations">Confirmations Required</Label>
            <p className="text-sm text-muted-foreground">
              Require explicit confirmation before sensitive operations
            </p>
          </div>
          <Switch
            id="confirmations"
            checked={confirmationsRequired}
            onCheckedChange={onConfirmationsRequiredChange}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Blocked Operations</Label>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="e.g. delete, transfer_funds"
              value={newBlocked}
              onChange={(e) => setNewBlocked(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addBlocked()}
              className="w-48"
              disabled={disabled}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBlocked}
              disabled={disabled || !newBlocked.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {blockedOperations.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {blockedOperations.map((op, i) => (
                <span
                  key={`${op}-${i}`}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm text-red-400',
                    !disabled && 'group'
                  )}
                >
                  {op}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => removeBlocked(i)}
                      className="rounded hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove ${op}`}
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
