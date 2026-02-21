import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface AcceptAgreeCTAProps {
  onAccept: () => Promise<unknown>
  isAccepted?: boolean
  isLoading?: boolean
  className?: string
}

/**
 * Accept/Agree CTA for enterprise onboarding.
 * Records user acceptance of terms.
 */
export function AcceptAgreeCTA({
  onAccept,
  isAccepted = false,
  isLoading = false,
  className,
}: AcceptAgreeCTAProps) {
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!agreed || isAccepted || isSubmitting) return
    setIsSubmitting(true)
    try {
      await onAccept()
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDisabled = !agreed || isAccepted || isLoading || isSubmitting

  return (
    <Card
      className={cn(
        'animate-fade-in-up transition-all duration-300',
        'hover:shadow-card-hover hover:-translate-y-0.5',
        'border-accent/20',
        className
      )}
    >
      <CardHeader>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Enterprise Onboarding
        </h2>
        <p className="text-sm text-muted-foreground">
          Accept the Terms of Service to complete your enterprise account setup.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAccepted ? (
          <div className="flex items-center gap-2 rounded-lg bg-accent-green/10 px-4 py-3 text-accent-green">
            <Check className="h-5 w-5 shrink-0" />
            <span className="font-medium">You have accepted the Terms of Service.</span>
          </div>
        ) : (
          <>
            <label
              htmlFor="terms-agree"
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
            >
              <Checkbox
                id="terms-agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <span className="text-sm text-muted-foreground">
                I have read and agree to the LifeOps Terms of Service, including user obligations,
                service limitations, and payment terms.
              </span>
            </label>
            <Button
              onClick={handleSubmit}
              disabled={isDisabled}
              className={cn(
                'w-full sm:w-auto',
                'bg-gradient-to-r from-accent to-primary',
                'transition-all duration-200 hover:scale-[1.02] hover:opacity-90',
                'disabled:opacity-50 disabled:hover:scale-100'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Accept & Agree
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
