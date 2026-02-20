import { Link } from 'react-router-dom'
import { Zap, Bot, Clock, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-accent/10 via-transparent to-accent-purple/10 animate-gradient-shift bg-[length:200%_200%]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background/95 to-background" />
      </div>

      {/* Navigation */}
      <nav className="flex h-16 items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Zap className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">LifeOps</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your AI Operating System for
            <span className="gradient-text block mt-2">Life & Projects</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Coordinated GPT-5 agents automate projects, content, finances, and health.
            Every action is explainable, permissioned, and reversible with full audit trails.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup">
              <Button size="xl" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl">
                Demo / Explore
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features - Bento grid */}
      <section className="px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-foreground">
            Trustworthy automation, built in
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Multi-agent orchestration with explainability, fine-grained permissions, and enterprise-grade auditability.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Bot,
                title: 'Multi-Agent Orchestration',
                description: 'Explicit message routing, scoped memory, and consensus resolve conflicting actions across agents.',
                className: 'lg:col-span-2',
              },
              {
                icon: Clock,
                title: 'Cronjobs as First-Class',
                description: 'Full schema for scheduling, triggers, constraints, safety rails, and retry policies.',
                className: '',
              },
              {
                icon: Shield,
                title: 'Explainability & Reversibility',
                description: 'Immutable traces, generated rationales, diffs, and revert actions for every external change.',
                className: '',
              },
              {
                icon: Zap,
                title: 'Permissioned Automation',
                description: 'RBAC and job-level automation: suggest-only, approval-required, conditional auto-execute.',
                className: 'lg:col-span-2',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={cn(
                  'group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/30',
                  feature.className
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-12 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to automate with confidence?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join individuals, teams, and enterprises who trust LifeOps for their automation.
          </p>
          <div className="mt-8">
            <Link to="/signup">
              <Button size="xl">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <span className="font-medium text-foreground">LifeOps</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/help" className="hover:text-foreground">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
