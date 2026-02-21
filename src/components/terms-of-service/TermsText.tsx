import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { UserCheck, Shield, CreditCard } from 'lucide-react'

export interface TermsTextProps {
  className?: string
}

const SECTIONS = [
  {
    id: 'user-obligations',
    icon: UserCheck,
    title: '1. User Obligations',
    content:
      'By using LifeOps, you agree to: (a) provide accurate account information; (b) maintain the security of your credentials; (c) use the service only for lawful purposes; (d) not reverse-engineer, decompile, or disassemble the platform; (e) not resell or sublicense access without authorization; and (f) comply with all applicable laws and regulations.',
  },
  {
    id: 'service-limitations',
    icon: Shield,
    title: '2. Service Limitations',
    content:
      'LifeOps is provided "as is" and "as available." We do not warrant uninterrupted, error-free, or secure operation. Service availability, features, and integrations may change. We are not liable for indirect, incidental, special, or consequential damages. Our total liability is limited to the fees paid by you in the twelve months preceding the claim.',
  },
  {
    id: 'payment-terms',
    icon: CreditCard,
    title: '3. Payment Terms',
    content:
      'Subscription fees are billed in advance (monthly or annually). You authorize recurring charges until cancellation. Refunds are provided per our refund policy. Price changes apply to subsequent billing cycles with at least 30 days notice. Enterprise plans may have custom terms as specified in your order form.',
  },
] as const

/**
 * Terms Text: user obligations, service limitations, payment terms.
 * Legal content governing use of LifeOps.
 * Uses design tokens (CSS variables) for all colors—no hardcoded hex values.
 */
export function TermsText({ className }: TermsTextProps) {
  return (
    <Card
      id="terms-heading"
      className={cn(
        'animate-fade-in border-accent/10',
        'transition-all duration-300 hover:shadow-card-hover hover:border-accent/20',
        className
      )}
    >
      <CardHeader className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          Terms of Service
        </h2>
        <p className="text-sm text-muted-foreground">Last updated: February 20, 2025</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="space-y-6 sm:space-y-8">
          {SECTIONS.map((section, index) => {
            const Icon = section.icon
            return (
              <section
                key={section.id}
                className={cn(
                  'space-y-3 sm:space-y-4',
                  index > 0 && 'mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border'
                )}
              >
                <h3 className="flex items-center gap-2 text-base font-medium text-foreground sm:text-lg">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {section.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {section.content}
                </p>
              </section>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
