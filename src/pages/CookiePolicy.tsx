import { Link } from 'react-router-dom'
import { Cookie, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Cookie className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cookie Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: February 2025</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">What are cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit our website. They
              help us provide a better experience by remembering your preferences and understanding
              how you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">How we use cookies</h2>
            <p>
              LifeOps uses cookies to: authenticate your session, remember your preferences,
              analyze site traffic and usage patterns, and improve our services. We do not sell your
              data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Your choices</h2>
            <p>
              You can accept or decline non-essential cookies when you first visit our site. You
              can also change your preferences at any time through your browser settings or by
              clearing your cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p>
              If you have questions about our cookie policy, please contact us at{' '}
              <a
                href="mailto:privacy@lifeops.example"
                className="text-accent hover:underline"
              >
                privacy@lifeops.example
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link to="/">
            <Button variant="outline" className="transition-all duration-200 hover:scale-[1.02]">
              Back to home
            </Button>
          </Link>
          <Link to="/terms-of-service">
            <Button variant="ghost" className="transition-all duration-200 hover:scale-[1.02]">
              Terms of Service
            </Button>
          </Link>
          <Link to="/privacy">
            <Button variant="ghost" className="transition-all duration-200 hover:scale-[1.02]">
              Privacy Policy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
