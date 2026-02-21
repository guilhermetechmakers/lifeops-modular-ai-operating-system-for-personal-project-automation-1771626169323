import { Link } from 'react-router-dom'
import { Home, LayoutDashboard, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-purple/5" />
      </div>

      <Card className={cn('w-full max-w-md text-center animate-fade-in-up')}>
        <CardContent className="pt-12 pb-12 px-6 sm:px-8">
          <div className="flex justify-center" aria-hidden>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <Search className="h-8 w-8 text-muted-foreground" aria-hidden />
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
            404
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <Link to="/">
                <Home className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <Link to="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
