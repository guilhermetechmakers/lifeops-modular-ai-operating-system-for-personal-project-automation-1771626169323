import { CreditCard, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function BillingPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Billing & Plans
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription and usage
          </p>
        </div>
        <Button>Upgrade Plan</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Visa ending in 4242</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 rounded-lg border border-border p-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Download past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: 'Feb 2025', amount: '$29.00', status: 'Paid' },
              { date: 'Jan 2025', amount: '$29.00', status: 'Paid' },
              { date: 'Dec 2024', amount: '$29.00', status: 'Paid' },
            ].map((inv) => (
              <div
                key={inv.date}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{inv.date}</p>
                    <p className="text-sm text-muted-foreground">{inv.amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="success">{inv.status}</Badge>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
