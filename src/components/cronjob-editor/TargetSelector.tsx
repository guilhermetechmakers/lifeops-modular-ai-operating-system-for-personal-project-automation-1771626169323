import { useState, useMemo } from 'react'
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
import { Search, Bot, Workflow, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

const MOCK_AGENTS = [
  { id: 'content-sync-agent', name: 'Content Sync Agent', type: 'agent' },
  { id: 'finance-agent', name: 'Finance Report Agent', type: 'agent' },
  { id: 'pr-summary-workflow', name: 'PR Summary Workflow', type: 'workflow' },
  { id: 'health-check-agent', name: 'Health Check Agent', type: 'agent' },
  { id: 'content-publish-workflow', name: 'Content Publish Workflow', type: 'workflow' },
]

interface TargetSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string
  required?: boolean
  agents?: { id: string; name: string; type: string }[]
}

export function TargetSelector({
  value,
  onChange,
  disabled,
  error,
  required,
  agents = MOCK_AGENTS,
}: TargetSelectorProps) {
  const [search, setSearch] = useState('')
  const errorId = 'target-select-error'
  const showError = error || (required && !value?.trim())

  const filtered = useMemo(() => {
    if (!search.trim()) return agents
    const q = search.toLowerCase()
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
    )
  }, [agents, search])

  const selected = agents.find((a) => a.id === value)

  return (
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" aria-hidden />
          <div>
            <CardTitle>Target Selector</CardTitle>
            <CardDescription>
              Agent or workflow template to execute
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target-search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="target-search"
              placeholder="Search agents or workflows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 transition-all duration-200 focus:border-accent/50"
              disabled={disabled}
              aria-label="Search agents or workflows"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="target-select">
            Target
            {required && <span className="text-destructive ml-0.5" aria-hidden>*</span>}
          </Label>
          <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger
              id="target-select"
              aria-label="Select target agent or workflow"
              aria-invalid={!!showError}
              aria-describedby={showError ? errorId : undefined}
              className={cn(
                'transition-all duration-200',
                showError && 'border-destructive/50 focus:ring-destructive/20'
              )}
            >
              <SelectValue placeholder="Select agent or workflow">
                {selected && (
                  <div className="flex items-center gap-2">
                    {selected.type === 'agent' ? (
                      <Bot className="h-4 w-4 text-muted-foreground" aria-hidden />
                    ) : (
                      <Workflow className="h-4 w-4 text-muted-foreground" aria-hidden />
                    )}
                    <span>{selected.name}</span>
                    <span className="text-xs text-muted-foreground">({selected.id})</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {filtered.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center gap-3 py-8 px-4"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      No agents or workflows found
                    </p>
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                      {search.trim()
                        ? 'Try a different search term or clear the search to see all options.'
                        : 'No agents or workflows are available. Add some to get started.'}
                    </p>
                  </div>
                </div>
              ) : (
                filtered.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    <div className="flex items-center gap-2">
                      {a.type === 'agent' ? (
                        <Bot className="h-4 w-4" aria-hidden />
                      ) : (
                        <Workflow className="h-4 w-4" aria-hidden />
                      )}
                      <span>{a.name}</span>
                      <span className="text-xs text-muted-foreground">({a.id})</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or enter target ID manually"
            className="mt-2 font-mono text-xs"
            disabled={disabled}
            aria-label="Or enter target ID manually"
          />
          {showError && (
            <p
              id={errorId}
              role="alert"
              className={cn(
                'text-sm text-destructive animate-fade-in',
                'transition-all duration-200'
              )}
            >
              {error ?? (required && !value?.trim() ? 'Please select or enter a target.' : '')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
