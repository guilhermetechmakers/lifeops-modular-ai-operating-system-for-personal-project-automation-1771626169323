import { FileText, GitMerge, DollarSign, CheckSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState, ErrorState, SkeletonList } from '@/components/ui/loading-states'

const mockApprovals = [
  {
    id: '1',
    action: 'Publish blog post "Getting Started with LifeOps"',
    agent: 'Content Agent',
    type: 'content',
    time: '5 min ago',
    cost: '$0.02',
  },
  {
    id: '2',
    action: 'Merge PR #42: Add dashboard widgets',
    agent: 'Dev Agent',
    type: 'code',
    time: '12 min ago',
    cost: '$0.05',
  },
  {
    id: '3',
    action: 'Create invoice for Client XYZ',
    agent: 'Finance Agent',
    type: 'finance',
    time: '1h ago',
    cost: '$0.01',
  },
]

const typeIcons = { content: FileText, code: GitMerge, finance: DollarSign }

export interface ApprovalItem {
  id: string
  action: string
  agent: string
  type: 'content' | 'code' | 'finance'
  time: string
  cost: string
}

export interface ApprovalsQueueProps {
  items?: ApprovalItem[]
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

export function ApprovalsQueue({
  items,
  isLoading = false,
  hasError = false,
  onRetry,
}: ApprovalsQueueProps = {}) {
  const approvals = items ?? mockApprovals
  const isEmpty = approvals.length === 0

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-section text-foreground sm:text-3xl">
            Approvals Queue
          </h1>
          <p className="mt-1 text-body-sm text-muted-foreground sm:text-base">
            Review and approve pending actions
          </p>
        </div>
        {!isEmpty && (
          <Button variant="outline" className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            Bulk Approve Selected
          </Button>
        )}
      </div>

      {isLoading ? (
        <SkeletonList items={3} variant="default" />
      ) : hasError ? (
        <ErrorState
          title="Failed to load approvals"
          message="We couldn't load your pending approvals. Please try again."
          onRetry={onRetry}
          retryLabel="Retry"
        />
      ) : isEmpty ? (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
          <CardContent className="py-16">
            <EmptyState
              icon={CheckSquare}
              heading="No pending approvals"
              description="When agents request approval for content, code, or finance actions, they'll appear here for your review."
              actionLabel="Go to Dashboard"
              actionHref="/dashboard"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvals.map((item) => {
            const Icon = typeIcons[item.type as keyof typeof typeIcons] ?? FileText
            return (
              <Card
                key={item.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-card-hover"
              >
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-heading-card text-foreground">
                        {item.action}
                      </CardTitle>
                      <CardDescription className="text-body-sm text-muted-foreground">
                        {item.agent} · {item.time} · Est. {item.cost}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      View Diff
                    </Button>
                    <Button
                      size="sm"
                      className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Reject
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="border-t border-border pt-4">
                  <p className="text-body-sm text-muted-foreground">
                    Agent rationale: This action aligns with the content calendar and has been reviewed for accuracy.
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
