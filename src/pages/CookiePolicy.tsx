import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function CookiePolicyPage() {
  useEffect(() => {
    const prevTitle = document.title
    const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute('content')
    document.title = 'Cookie Policy — LifeOps'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn how LifeOps uses cookies to improve your experience, authenticate sessions, and analyze site usage.'
      )
    }
    return () => {
      document.title = prevTitle
      if (metaDesc && prevDesc) metaDesc.setAttribute('content', prevDesc)
    }
  }, [])

  const sections: { id: string; title: string; content: ReactNode }[] = [
    {
      id: 'what-are-cookies',
      title: 'What are cookies',
      content:
        'Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences and understanding how you use our services.',
    },
    {
      id: 'how-we-use',
      title: 'How we use cookies',
      content:
        'LifeOps uses cookies to: authenticate your session, remember your preferences, analyze site traffic and usage patterns, and improve our services. We do not sell your data to third parties.',
    },
    {
      id: 'your-choices',
      title: 'Your choices',
      content:
        'You can accept or decline non-essential cookies when you first visit our site. You can also change your preferences at any time through your browser settings or by clearing your cookies.',
    },
    {
      id: 'contact',
      title: 'Contact',
      content: (
        <p>
          If you have questions about our cookie policy, please contact us at{' '}
          <a
            href="mailto:privacy@lifeops.example"
            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            aria-label="Send email to privacy team at privacy@lifeops.example"
          >
            privacy@lifeops.example
          </a>
          .
        </p>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            aria-label="Navigate back to home page"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
        </nav>

        <header className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              aria-hidden
            >
              <Cookie className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Cookie Policy
              </h1>
              <p className="text-sm text-muted-foreground">Last updated: February 2025</p>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card
              key={section.id}
              role="region"
              aria-labelledby={section.id}
              className={cn(
                'transition-all duration-300',
                index === 0 && 'animate-fade-in-up',
                index === 1 && 'animate-fade-in-up-delay-1',
                index === 2 && 'animate-fade-in-up-delay-2',
                index === 3 && 'animate-fade-in-up-delay-3'
              )}
            >
              <CardHeader className="pb-2">
                <h2
                  id={section.id}
                  className="text-lg font-semibold leading-none tracking-tight text-foreground"
                >
                  {section.title}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground leading-relaxed">
                  {typeof section.content === 'string' ? (
                    <p>{section.content}</p>
                  ) : (
                    section.content
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-12 border-t border-border pt-8">
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline" className="transition-all duration-200 hover:scale-[1.02]">
              <Link
                to="/"
                aria-label="Navigate back to home page"
              >
                Back to home
              </Link>
            </Button>
            <Button asChild variant="ghost" className="transition-all duration-200 hover:scale-[1.02]">
              <Link
                to="/terms-of-service"
                aria-label="Navigate to Terms of Service"
              >
                Terms of Service
              </Link>
            </Button>
            <Button asChild variant="ghost" className="transition-all duration-200 hover:scale-[1.02]">
              <Link
                to="/privacy"
                aria-label="Navigate to Privacy Policy"
              >
                Privacy Policy
              </Link>
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
