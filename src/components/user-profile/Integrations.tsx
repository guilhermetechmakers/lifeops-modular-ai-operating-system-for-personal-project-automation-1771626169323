import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Plug, Link2, Unlink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Integration } from '@/types/user-profile'

const ICON_MAP: Record<string, React.ElementType> = {
  slack: Plug,
  github: Plug,
  google: Plug,
  notion: Plug,
  linear: Plug,
}

export interface IntegrationsProps {
  integrations: Integration[]
  onConnect: (id: string) => Promise<void>
  onDisconnect: (id: string) => Promise<void>
  isLoading?: boolean
  className?: string
}

export function Integrations({
  integrations,
  onConnect,
  onDisconnect,
  isLoading,
  className,
}: IntegrationsProps) {
  const handleConnect = async (id: string) => {
    try {
      await onConnect(id)
      toast.success('Integration connected')
    } catch {
      toast.error('Failed to connect')
    }
  }

  const handleDisconnect = async (id: string) => {
    try {
      await onDisconnect(id)
      toast.success('Integration disconnected')
    } catch {
      toast.error('Failed to disconnect')
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
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
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
            Integrations
          </CardTitle>
          <CardDescription>Connect external services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary mb-4">
              <Plug className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">No integrations yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Connect services like Slack, GitHub, and Google to extend your workflow.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Integrations will appear here once available.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

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
          Integrations
        </CardTitle>
        <CardDescription>Connected services with connect/disconnect actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {integrations.map((int) => {
            const Icon = ICON_MAP[int.icon] ?? Plug
            return (
              <div
                key={int.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:bg-secondary/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{int.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {int.connected
                        ? `Connected ${int.connected_at ? new Date(int.connected_at).toLocaleDateString() : ''}`
                        : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={int.connected ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => (int.connected ? handleDisconnect(int.id) : handleConnect(int.id))}
                >
                  {int.connected ? (
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
      </CardContent>
    </Card>
  )
}
