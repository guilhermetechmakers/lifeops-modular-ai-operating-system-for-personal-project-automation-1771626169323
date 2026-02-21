import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, ExternalLink, ChevronRight } from 'lucide-react'
import { useActivityLog } from '@/hooks/use-user-profile'
import { EmptyState, ErrorState } from '@/components/ui/loading-states'
import { cn } from '@/lib/utils'

const ACTION_ICONS: Record<string, React.ElementType> = {
  login: Activity,
  logout: Activity,
  create: Activity,
  update: Activity,
  delete: Activity,
}

function getActionIcon(action: string): React.ElementType {
  const key = action.toLowerCase().split(' ')[0]
  return ACTION_ICONS[key] ?? Activity
}

export function AuditLogPage() {
  const { data: entries, isLoading, isError, refetch } = useActivityLog(50)

  return (
    <div className="space-y-8 animate-fade-in">
      <nav
        className="flex items-center gap-2 text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link to="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <Link to="/dashboard/user-profile" className="hover:text-foreground transition-colors">
          User Profile
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <span className="text-foreground font-medium">Audit Log</span>
      </nav>

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
          Audit Log
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Full history of account actions and security events
        </p>
      </div>

      <Card
        className={cn(
          'transition-all duration-300 hover:shadow-card-hover',
          'border border-border hover:border-accent/20'
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity History
              </CardTitle>
              <CardDescription>Recent actions and audit trail</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild aria-label="Back to User Profile">
              <Link to="/dashboard/user-profile">
                User Profile
                <ExternalLink className="h-4 w-4 ml-1" aria-hidden />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-lg border border-border p-4"
                >
                  <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              title="Failed to load audit log"
              message="We couldn't load your activity history. Please try again."
              onRetry={() => refetch()}
              retryLabel="Retry"
            />
          ) : !entries?.length ? (
            <EmptyState
              icon={Activity}
              heading="No activity yet"
              description="Your account actions will appear here. Sign in, update settings, or use API keys to generate activity."
              actionLabel="User Profile"
              actionHref="/dashboard/user-profile"
            />
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => {
                const Icon = getActionIcon(entry.action)
                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 rounded-lg border border-border p-4 transition-all duration-200 hover:bg-secondary/30 hover:border-accent/10"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{entry.action}</p>
                      <p className="text-sm text-muted-foreground">{entry.resource}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.timestamp).toLocaleString()}
                        {entry.ip_address && ` · ${entry.ip_address}`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
