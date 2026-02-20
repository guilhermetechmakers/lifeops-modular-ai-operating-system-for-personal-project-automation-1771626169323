import { FileText, GitMerge, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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

export function ApprovalsQueue() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Approvals Queue
          </h1>
          <p className="text-muted-foreground">
            Review and approve pending actions
          </p>
        </div>
        <Button variant="outline">Bulk Approve Selected</Button>
      </div>

      <div className="space-y-4">
        {mockApprovals.map((item) => {
          const Icon = typeIcons[item.type as keyof typeof typeIcons] ?? FileText
          return (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{item.action}</CardTitle>
                    <CardDescription>
                      {item.agent} · {item.time} · Est. {item.cost}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Diff
                  </Button>
                  <Button size="sm">Approve</Button>
                  <Button variant="destructive" size="sm">
                    Reject
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Agent rationale: This action aligns with the content calendar and has been reviewed for accuracy.
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {mockApprovals.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No pending approvals
            </h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              When agents request approval for actions, they&apos;ll appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
