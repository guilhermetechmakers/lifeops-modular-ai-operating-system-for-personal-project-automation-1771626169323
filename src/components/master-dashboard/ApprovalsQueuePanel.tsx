import { Link } from 'react-router-dom'
import { FileText, GitMerge, DollarSign, ArrowUpRight, CheckSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState, SkeletonList } from '@/components/ui/loading-states'
import type { ApprovalItem } from '@/types/master-dashboard'

export interface ApprovalsQueuePanelProps {
  items?: ApprovalItem[]
  isLoading?: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  className?: string
}

const typeIcons = {
  content: FileText,
  code: GitMerge,
  finance: DollarSign,
}

export function ApprovalsQueuePanel({
  items = [],
  isLoading,
  onApprove,
  onReject,
  className,
}: ApprovalsQueuePanelProps) {
  if (isLoading) {
    return (
      <SkeletonList
        className={className}
        items={3}
        variant="default"
      />
    )
  }

  if (items.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Approvals Queue</CardTitle>
            <CardDescription>Items requiring your review</CardDescription>
          </div>
          <Link to="/dashboard/approvals">
            <Button variant="ghost" size="sm" className="transition-all hover:scale-[1.02]">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={CheckSquare}
            heading="No pending approvals"
            description="When agents request approval for content, code, or finance actions, they'll appear here for your review."
            actionLabel="View Approvals"
            actionHref="/dashboard/approvals"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Approvals Queue</CardTitle>
          <CardDescription>Items requiring your review</CardDescription>
        </div>
        <Link to="/dashboard/approvals">
          <Button variant="ghost" size="sm" className="transition-all hover:scale-[1.02]">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => {
            const Icon = typeIcons[item.type] ?? FileText
            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-border p-3 transition-all duration-200 hover:border-accent/30 hover:bg-secondary/50"
              >
                <div className="flex gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.agent} · {item.time}
                      {item.cost && ` · ${item.cost}`}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    onClick={() => onApprove?.(item.id)}
                    className="transition-all hover:scale-[1.02]"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject?.(item.id)}
                    className="transition-all hover:scale-[1.02]"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
