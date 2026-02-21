import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const COOKIE_CONSENT_KEY = 'lifeops-cookie-consent'

export interface CookieConsentBannerProps {
  className?: string
}

export function CookieConsentBanner({ className }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (!stored) {
        setIsVisible(true)
      }
    } catch {
      setIsVisible(true)
    }
  }, [])

  function persistAndHide(choice: 'accept' | 'decline') {
    setIsExiting(true)
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice)
    } catch {
      // Ignore
    }
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!isVisible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 transition-all duration-300',
        !isExiting ? 'animate-fade-in-up' : 'translate-y-4 opacity-0',
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-border bg-card/95 p-4 shadow-card backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Cookie className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">We use cookies</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We use cookies to improve your experience, analyze site traffic, and personalize
              content. By continuing, you accept our{' '}
              <Link
                to="/cookies"
                className="text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                cookie policy
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="transition-all duration-200 hover:scale-[1.02]"
            onClick={() => persistAndHide('decline')}
          >
            Decline
          </Button>
          <Button
            size="sm"
            className="transition-all duration-200 hover:scale-[1.02] hover:shadow-accent-glow"
            onClick={() => persistAndHide('accept')}
          >
            Accept all
          </Button>
          <button
            type="button"
            onClick={() => persistAndHide('decline')}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
