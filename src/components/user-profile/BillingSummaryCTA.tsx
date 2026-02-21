import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BillingSummaryCTAProps {
  planName?: string
  planAmount?: string
  className?: string
}

export function BillingSummaryCTA({
  planName = 'Pro',
  planAmount = '$29/month',
  className,
}: BillingSummaryCTAProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-300',
        'hover:shadow-card-hover hover:scale-[1.01]',
        'bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20',
        'hover:border-accent/40',
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing Summary
        </CardTitle>
        <CardDescription>View invoices, usage, and payment methods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-medium text-foreground">{planName} Plan</p>
            <p className="text-sm text-muted-foreground">{planAmount}</p>
          </div>
          <Button asChild className="group transition-transform duration-200" aria-label="View billing page">
            <Link to="/dashboard/billing">
              View billing page
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
