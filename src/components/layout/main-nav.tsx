import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Zap, Menu, X, HelpCircle, Scale, Shield, Cookie, LayoutDashboard, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/help', label: 'Help', icon: HelpCircle },
  { to: '/terms-of-service', label: 'Terms', icon: Scale },
  { to: '/privacy', label: 'Privacy', icon: Shield },
  { to: '/cookies', label: 'Cookies', icon: Cookie },
] as const

export interface MainNavProps {
  /** Show sticky header with backdrop blur on scroll */
  sticky?: boolean
  className?: string
}

/**
 * Main navigation for standalone pages (Help, Terms, Privacy, Cookies).
 * Provides consistent navigation with logo, legal links, and auth CTAs.
 */
export function MainNav({ sticky = true, className }: MainNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <header
      className={cn(
        'flex h-16 items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-12',
        sticky && 'sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50',
        className
      )}
      role="banner"
    >
      <Link
        to="/"
        className="flex items-center gap-2 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg shrink-0"
        aria-label="LifeOps home"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-accent-glow">
          <Zap className="h-5 w-5 text-accent-foreground" aria-hidden />
        </div>
        <span className="text-xl font-bold text-foreground">LifeOps</span>
      </Link>

      {/* Desktop nav */}
      <nav
        className="hidden md:flex items-center gap-1"
        aria-label="Main navigation"
      >
        {navLinks.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`)
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Desktop CTAs */}
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="transition-all duration-200 hover:scale-[1.02]">
          <Link to="/login-/-signup" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" aria-hidden />
            Sign in
          </Link>
        </Button>
        <Button size="sm" asChild className="transition-all duration-200 hover:scale-[1.02] hover:shadow-accent-glow">
          <Link to="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            Dashboard
          </Link>
        </Button>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden shrink-0"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="fixed top-16 left-0 right-0 z-50 border-b border-border bg-card shadow-lg md:hidden animate-fade-in"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'bg-accent/10 text-accent' : 'text-foreground hover:bg-secondary'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {label}
                  </Link>
                )
              })}
              <div className="my-2 border-t border-border" />
              <Link
                to="/login-/-signup"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary"
              >
                <LogIn className="h-4 w-4 shrink-0" aria-hidden />
                Sign in
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
                Dashboard
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
