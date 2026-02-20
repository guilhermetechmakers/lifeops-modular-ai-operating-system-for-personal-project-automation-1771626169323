import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap,
  Bot,
  Clock,
  Shield,
  ArrowRight,
  FolderKanban,
  FileText,
  Wallet,
  Heart,
  Check,
  Sparkles,
  Users,
  Building2,
  User,
  HelpCircle,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'

function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: 0 | 1 | 2 | 3 | 4
}) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true })
  const delayClass =
    delay === 0
      ? 'animate-fade-in-up'
      : delay === 1
        ? 'animate-fade-in-up-delay-1'
        : delay === 2
          ? 'animate-fade-in-up-delay-2'
          : delay === 3
            ? 'animate-fade-in-up-delay-3'
            : 'animate-fade-in-up-delay-4'

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity',
        isInView ? delayClass : 'opacity-0 translate-y-4',
        className
      )}
    >
      {children}
    </div>
  )
}

export function LandingPage() {
  useEffect(() => {
    document.title = 'LifeOps — AI Operating System for Life & Projects'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Coordinated AI agents automate projects, content, finances, and health. Explainable, permissioned, reversible automation with full audit trails.'
      )
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content =
        'Coordinated AI agents automate projects, content, finances, and health. Explainable, permissioned, reversible automation with full audit trails.'
      document.head.appendChild(meta)
    }
    return () => {
      document.title = 'LifeOps — AI Operating System for Life & Projects'
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-accent/10 via-transparent to-accent-purple/10 animate-gradient-shift bg-[length:200%_200%]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background/95 to-background" />
      </div>

      {/* Navigation */}
      <nav className="flex h-16 items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-accent-glow">
            <Zap className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">LifeOps</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login-/-signup">
            <Button variant="ghost" className="transition-all duration-200 hover:scale-[1.02]">
              Sign in
            </Button>
          </Link>
          <Link to="/login-/-signup">
            <Button className="transition-all duration-200 hover:scale-[1.02] hover:shadow-accent-glow">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your AI Operating System for
              <span className="gradient-text block mt-2">Life & Projects</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={1}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Coordinated GPT-5 agents automate projects, content, finances, and health.
              Every action is explainable, permissioned, and reversible with full audit trails.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={2}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/login-/-signup">
                <Button
                  size="xl"
                  className="group transition-all duration-200 hover:scale-[1.05] hover:shadow-accent-glow"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login-/-signup">
                <Button
                  variant="outline"
                  size="xl"
                  className="group transition-all duration-200 hover:scale-[1.02] hover:border-accent/50"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Demo / Explore
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features - Bento grid */}
      <section className="px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="text-center text-3xl font-bold text-foreground">
              Trustworthy automation, built in
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Multi-agent orchestration with explainability, fine-grained permissions, and
              enterprise-grade auditability.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Bot,
                title: 'Multi-Agent Orchestration',
                description:
                  'Explicit message routing, scoped memory, and consensus resolve conflicting actions across agents.',
                className: 'lg:col-span-2',
              },
              {
                icon: Clock,
                title: 'Cronjobs as First-Class',
                description:
                  'Full schema for scheduling, triggers, constraints, safety rails, and retry policies.',
                className: '',
              },
              {
                icon: Shield,
                title: 'Explainability & Reversibility',
                description:
                  'Immutable traces, generated rationales, diffs, and revert actions for every external change.',
                className: '',
              },
              {
                icon: Zap,
                title: 'Permissioned Automation',
                description:
                  'RBAC and job-level automation: suggest-only, approval-required, conditional auto-execute.',
                className: 'lg:col-span-2',
              },
            ].map((feature, i) => (
              <AnimatedSection key={feature.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div
                  className={cn(
                    'group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/30',
                    feature.className
                  )}
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
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="text-center text-3xl font-bold text-foreground">
              Built for how you work
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Whether you&apos;re a solo creator, team lead, or enterprise, LifeOps adapts to
              your workflow.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: User,
                title: 'Individuals & Creators',
                description:
                  'Automate content pipelines, personal finance tracking, and health habits. One agent, your rules.',
              },
              {
                icon: Users,
                title: 'Teams & Startups',
                description:
                  'Shared workspaces, approval workflows, and role-based access. Ship faster with coordinated automation.',
              },
              {
                icon: Building2,
                title: 'Enterprises',
                description:
                  'SSO, audit logs, and compliance-ready controls. Scale automation across departments safely.',
              },
            ].map((uc, i) => (
              <AnimatedSection key={uc.title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-purple/20 text-accent-purple">
                    <uc.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{uc.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{uc.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="text-center text-3xl font-bold text-foreground">
              Start with templates
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Pre-built workflows to get you running in minutes. Customize or create from
              scratch.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: FolderKanban, label: 'Project Sprint', desc: 'Tickets, PRs, releases' },
              { icon: FileText, label: 'Content Pipeline', desc: 'Ideas → drafts → publish' },
              { icon: Wallet, label: 'Finance Review', desc: 'Categorize, forecast, close' },
              { icon: Heart, label: 'Health Tracker', desc: 'Habits, goals, recovery' },
            ].map((t, i) => (
              <AnimatedSection key={t.label} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <div className="rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/30">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent-blue/20 text-accent-blue">
                    <t.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{t.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="text-center text-3xl font-bold text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Start free. Scale as you grow. No hidden fees.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: ['Up to 3 agents', '5 cronjobs', 'Basic templates', 'Community support'],
                cta: 'Get Started Free',
                highlighted: false,
              },
              {
                name: 'Pro',
                price: '$29',
                period: '/month',
                features: [
                  'Unlimited agents',
                  'Unlimited cronjobs',
                  'All templates',
                  'Priority support',
                  'Advanced analytics',
                ],
                cta: 'Start Pro Trial',
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                features: [
                  'Everything in Pro',
                  'SSO / SAML',
                  'Dedicated support',
                  'Custom SLAs',
                  'On-premise option',
                ],
                cta: 'Contact Sales',
                highlighted: false,
              },
            ].map((plan, i) => (
              <AnimatedSection key={plan.name} delay={(i % 3) as 0 | 1 | 2}>
                <div
                  className={cn(
                    'rounded-xl border p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1',
                    plan.highlighted
                      ? 'border-accent bg-accent/5 shadow-accent-glow'
                      : 'border-border bg-card hover:border-accent/30'
                  )}
                >
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 shrink-0 text-accent-green" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.name === 'Enterprise' ? (
                    <a href="mailto:sales@lifeops.example" className="block mt-8">
                      <Button
                        variant={plan.highlighted ? 'default' : 'outline'}
                        className="w-full transition-all duration-200 hover:scale-[1.02]"
                      >
                        {plan.cta}
                      </Button>
                    </a>
                  ) : (
                    <Link to="/login-/-signup" className="block mt-8">
                      <Button
                        variant={plan.highlighted ? 'default' : 'outline'}
                        className="w-full transition-all duration-200 hover:scale-[1.02]"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 lg:px-12">
        <AnimatedSection>
          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-12 text-center transition-all duration-300 hover:shadow-card-hover hover:border-accent/30">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Ready to automate with confidence?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join individuals, teams, and enterprises who trust LifeOps for their
              automation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/login-/-signup">
                <Button
                  size="xl"
                  className="transition-all duration-200 hover:scale-[1.05] hover:shadow-accent-glow"
                >
                  Sign up free
                </Button>
              </Link>
              <Link to="/login-/-signup">
                <Button
                  variant="outline"
                  size="xl"
                  className="transition-all duration-200 hover:scale-[1.02]"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <span className="font-medium text-foreground">LifeOps</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link
              to="/help"
              className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Link>
            <a
              href="mailto:sales@lifeops.example"
              className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact Sales
            </a>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
