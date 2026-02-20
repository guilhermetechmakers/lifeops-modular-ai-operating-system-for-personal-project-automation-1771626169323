import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, FileText, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActivityLogEntry } from '@/types/user-profile'

export interface ActivityLogProps {
  entries: ActivityLogEntry[]
  isLoading?: boolean
  className?: string
}

const ACTION_ICONS: Record<string, React.ElementType> = {
  login: Activity,
  logout: Activity,
  create: FileText,
  update: FileText,
  delete: FileText,
}

function getActionIcon(action: string): React.ElementType {
  const key = action.toLowerCase().split(' ')[0]
  return ACTION_ICONS[key] ?? Activity
}

export function ActivityLog({ entries, isLoading, className }: ActivityLogProps) {
  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-40 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-card-hover', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Log
            </CardTitle>
            <CardDescription>Recent actions and audit links</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/settings">
              Full audit log
              <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground">No recent activity</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Your recent actions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const Icon = getActionIcon(entry.action)
              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {entry.action}
                    </p>
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
  )
}
