import { Link } from 'react-router-dom'
import { CreditCard, FileText, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, ErrorState } from '@/components/ui/loading-states'
import { cn } from '@/lib/utils'

export interface Invoice {
  id: string
  date: string
  amount: string
  status: 'Paid' | 'Pending' | 'Failed'
}

export interface BillingPageProps {
  invoices?: Invoice[]
  isLoadingInvoices?: boolean
  hasInvoicesError?: boolean
  onRetryInvoices?: () => void
}


function InvoiceListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border p-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-5 shrink-0 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function BillingPage({
  invoices = [],
  isLoadingInvoices = false,
  hasInvoicesError = false,
  onRetryInvoices,
}: BillingPageProps) {
  const showEmptyState = invoices.length === 0 && !isLoadingInvoices && !hasInvoicesError

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Billing & Plans
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage your subscription and usage
          </p>
        </div>
        <Button
          asChild
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
        >
          <Link to="/">Upgrade Plan</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Pro plan · $29/month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Agent runtime</span>
              <Badge variant="secondary">450 / 500 min</Badge>
            </div>
            <Progress value={90} className="h-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API calls</span>
              <Badge variant="secondary">12.4k / 15k</Badge>
            </div>
            <Progress value={82} className="h-2" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Visa ending in 4242</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
              <CreditCard className="h-8 w-8 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:ml-auto sm:w-auto">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Download past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingInvoices ? (
            <InvoiceListSkeleton />
          ) : hasInvoicesError ? (
            <ErrorState
              title="Failed to load invoices"
              message="We couldn't load your invoices. Please try again."
              onRetry={onRetryInvoices}
              retryLabel="Retry"
            />
          ) : showEmptyState ? (
            <EmptyState
              icon={FileText}
              heading="No invoices yet"
              description="Invoices will appear here once you have billing history. Upgrade your plan to get started."
              actionLabel="Upgrade Plan"
              actionHref="/"
            />
          ) : (
            <div className="space-y-4">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className={cn(
                    'flex flex-col gap-4 rounded-lg border border-border p-4 transition-all duration-200',
                    'sm:flex-row sm:items-center sm:justify-between',
                    'hover:border-border/80 hover:shadow-sm'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <FileText className="h-5 w-5 text-muted-foreground" aria-hidden />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{inv.date}</p>
                      <p className="text-sm text-muted-foreground">{inv.amount}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <Badge
                      variant={inv.status === 'Paid' ? 'success' : inv.status === 'Failed' ? 'destructive' : 'secondary'}
                    >
                      {inv.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-2" aria-label={`Download invoice ${inv.date}`}>
                      <Download className="h-4 w-4" aria-hidden />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
