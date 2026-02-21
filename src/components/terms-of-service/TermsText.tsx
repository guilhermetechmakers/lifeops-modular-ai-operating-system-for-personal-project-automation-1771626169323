import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface TermsTextProps {
  className?: string
}

/**
 * Terms Text: user obligations, service limitations, payment terms.
 * Legal content governing use of LifeOps.
 */
export function TermsText({ className }: TermsTextProps) {
  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardHeader>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Terms of Service
        </h2>
        <p className="text-sm text-muted-foreground">
          Last updated: February 20, 2025
        </p>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">1. User Obligations</h3>
            <p>
              By using LifeOps, you agree to: (a) provide accurate account information; (b) maintain
              the security of your credentials; (c) use the service only for lawful purposes; (d)
              not reverse-engineer, decompile, or disassemble the platform; (e) not resell or
              sublicense access without authorization; and (f) comply with all applicable laws and
              regulations.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            <h3 className="text-lg font-medium text-foreground">2. Service Limitations</h3>
            <p>
              LifeOps is provided &quot;as is&quot; and &quot;as available.&quot; We do not warrant
              uninterrupted, error-free, or secure operation. Service availability, features, and
              integrations may change. We are not liable for indirect, incidental, special, or
              consequential damages. Our total liability is limited to the fees paid by you in the
              twelve months preceding the claim.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            <h3 className="text-lg font-medium text-foreground">3. Payment Terms</h3>
            <p>
              Subscription fees are billed in advance (monthly or annually). You authorize recurring
              charges until cancellation. Refunds are provided per our refund policy. Price changes
              apply to subsequent billing cycles with at least 30 days notice. Enterprise plans may
              have custom terms as specified in your order form.
            </p>
          </section>
        </div>
      </CardContent>
    </Card>
  )
}
