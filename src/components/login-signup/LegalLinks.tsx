import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, FileText, Cookie } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LegalLinksProps {
  className?: string
}

export function LegalLinks({ className }: LegalLinksProps) {
  const [showCookieConsent, setShowCookieConsent] = useState(false)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <Link
          to="/terms-of-service"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <FileText className="h-3.5 w-3.5" />
          Terms
        </Link>
        <Link
          to="/privacy"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Shield className="h-3.5 w-3.5" />
          Privacy
        </Link>
        <button
          type="button"
          onClick={() => setShowCookieConsent(true)}
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <Cookie className="h-3.5 w-3.5" />
          Cookie consent
        </button>
      </div>

      {showCookieConsent && (
        <div
          className="rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground animate-fade-in"
          role="dialog"
          aria-label="Cookie consent"
        >
          <p className="mb-3">
            We use cookies to improve your experience and analyze site traffic.
            By continuing, you accept our cookie policy.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowCookieConsent(false)}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => setShowCookieConsent(false)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
