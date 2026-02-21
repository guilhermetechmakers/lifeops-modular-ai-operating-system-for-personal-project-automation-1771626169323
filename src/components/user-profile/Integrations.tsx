import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Link2,
  Unlink,
  Loader2,
  Github,
  Slack,
  CreditCard,
  HeartPulse,
  FileText,
  Plug,
  FolderKanban,
  LayoutGrid,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyState, ErrorState } from '@/components/ui/loading-states'
import type { Integration, IntegrationCategory } from '@/types/user-profile'

const CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  dev: 'Development',
  communication: 'Communication',
  finance: 'Finance',
  health: 'Health',
  cms: 'Content',
}

const ICON_MAP: Record<string, React.ElementType> = {
  github: Github,
  jira: FolderKanban,
  linear: LayoutGrid,
  slack: Slack,
  google: Plug,
  stripe: CreditCard,
  plaid: Wallet,
  health: HeartPulse,
  notion: FileText,
  cms: FileText,
}

export interface IntegrationsProps {
  integrations: Integration[]
  onConnect: (id: string) => Promise<void>
  onDisconnect: (id: string) => Promise<void>
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  className?: string
}

function groupByCategory(integrations: Integration[]): Map<IntegrationCategory | string, Integration[]> {
  const map = new Map<IntegrationCategory | string, Integration[]>()
  for (const int of integrations) {
    const cat = int.category ?? 'other'
    const list = map.get(cat) ?? []
    list.push(int)
    map.set(cat, list)
  }
  const order: (IntegrationCategory | string)[] = ['dev', 'communication', 'finance', 'health', 'cms', 'other']
  const sorted = new Map<IntegrationCategory | string, Integration[]>()
  for (const cat of order) {
    const list = map.get(cat)
    if (list?.length) sorted.set(cat, list)
  }
  for (const [cat, list] of map) {
    if (!sorted.has(cat)) sorted.set(cat, list)
  }
  return sorted
}

export function Integrations({
  integrations,
  onConnect,
  onDisconnect,
  isLoading,
  isError,
  onRetry,
  className,
}: IntegrationsProps) {
  const [actionId, setActionId] = useState<string | null>(null)

  const handleConnect = async (id: string) => {
    setActionId(id)
    try {
      await onConnect(id)
    } finally {
      setActionId(null)
    }
  }

  const handleDisconnect = async (id: string) => {
    setActionId(id)
    try {
      await onDisconnect(id)
    } finally {
      setActionId(null)
    }
  }

  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full skeleton-shimmer" />
          <Skeleton className="h-16 w-full skeleton-shimmer" />
          <Skeleton className="h-16 w-full skeleton-shimmer" />
          <Skeleton className="h-16 w-full skeleton-shimmer" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card
        className={cn(
          'transition-all duration-300 hover:shadow-card-hover',
          'border border-border hover:border-accent/20',
          className
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" aria-hidden />
            Third-Party Integrations
          </CardTitle>
          <CardDescription>Connect external services to extend your workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load integrations"
            message="We couldn't load your integrations. Please check your connection and try again."
            onRetry={onRetry}
            retryLabel="Retry"
          />
        </CardContent>
      </Card>
    )
  }

  if (integrations.length === 0) {
    return (
      <Card
        className={cn(
          'transition-all duration-300 hover:shadow-card-hover',
          'border border-border hover:border-accent/20',
          className
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Third-Party Integrations
          </CardTitle>
          <CardDescription>Connect external services to extend your workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Plug}
            heading="No integrations yet"
            description="Connect external services like GitHub, Jira, Stripe, Slack, Plaid, Health APIs, and CMS to automate your workflows. Integrations will appear here once configured."
          />
        </CardContent>
      </Card>
    )
  }

  const grouped = groupByCategory(integrations)

  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-card-hover',
        'border border-border hover:border-accent/20',
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Third-Party Integrations
        </CardTitle>
        <CardDescription>
          Connect external services (GitHub, Jira, Stripe, Slack, Plaid, Health APIs, CMS) with connect/disconnect actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([category, items], groupIdx) => (
            <div key={category} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {CATEGORY_LABELS[category as IntegrationCategory] ?? category}
              </h4>
              <div className="space-y-3">
                {items.map((int, idx) => {
                  const Icon = ICON_MAP[int.icon] ?? Plug
                  const isActioning = actionId === int.id
                  return (
                    <div
                      key={int.id}
                      className={cn(
                        'flex items-center justify-between rounded-lg border border-border p-4',
                        'transition-all duration-200 hover:border-accent/30 hover:bg-secondary/30',
                        'hover:shadow-sm'
                      )}
                      style={{
                        animationDelay: `${(groupIdx * 100 + idx * 50)}ms`,
                      }}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{int.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {int.connected
                              ? `Connected ${int.connected_at ? `since ${new Date(int.connected_at).toLocaleDateString()}` : ''}`
                              : int.description ?? 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={int.connected ? 'outline' : 'default'}
                        size="sm"
                        disabled={isActioning}
                        onClick={() =>
                          int.connected ? handleDisconnect(int.id) : handleConnect(int.id)
                        }
                        className="shrink-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        aria-label={
                          int.connected
                            ? `Disconnect ${int.name}`
                            : `Connect ${int.name}`
                        }
                      >
                        {isActioning ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : int.connected ? (
                          <>
                            <Unlink className="h-4 w-4" />
                            Disconnect
                          </>
                        ) : (
                          <>
                            <Link2 className="h-4 w-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
