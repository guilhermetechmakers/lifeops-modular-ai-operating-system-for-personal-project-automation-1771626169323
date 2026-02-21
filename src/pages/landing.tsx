import { useEffect, useState } from 'react'
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
  Cookie,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'
import { CookieConsentBanner } from '@/components/landing/CookieConsentBanner'

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
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

      {/* Scroll progress indicator */}
      {typeof window !== 'undefined' && (
        <div
          className="fixed top-0 left-0 right-0 z-40 h-0.5 bg-accent/30 origin-left"
          style={{
            transform: `scaleX(${(() => {
              const max = document.documentElement.scrollHeight - window.innerHeight
              return max > 0 ? Math.min(scrollY / max, 1) : 0
            })()})`,
          }}
          aria-hidden
        />
      )}

      {/* Sticky Navigation */}
      <nav
        className={cn(
          'sticky top-0 z-30 flex h-16 items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-12',
          scrollY > 20 && 'bg-background/80 backdrop-blur-md border-b border-border/50'
        )}
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
          aria-label="LifeOps home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-accent-glow">
            <Zap className="icon-md text-accent-foreground" aria-hidden />
          </div>
          <span className="text-xl font-bold text-foreground">LifeOps</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login-/-signup" aria-label="Sign in to your account">
            <Button variant="ghost" className="transition-all duration-200 hover:scale-[1.02]">
              Sign in
            </Button>
          </Link>
          <Link to="/login-/-signup" aria-label="Get started with LifeOps">
            <Button className="transition-all duration-200 hover:scale-[1.02] hover:shadow-accent-glow">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-12 lg:py-section-y-lg" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <h1
              id="hero-heading"
              className="text-heading-hero text-heading-hero-sm sm:text-heading-hero lg:text-heading-hero-lg"
            >
              Your AI Operating System for
              <span className="gradient-text block mt-2">Life & Projects</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={1}>
            <p className="mx-auto mt-6 max-w-2xl text-body-lg">
              Coordinated GPT-5 agents automate projects, content, finances, and health.
              Every action is explainable, permissioned, and reversible with full audit trails.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={2}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/login-/-signup" aria-label="Get started free">
                <Button
                  size="xl"
                  className="group animate-pulse-soft transition-all duration-200 hover:scale-[1.05] hover:shadow-accent-glow motion-reduce:animate-none"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 icon-md transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
              </Link>
              <Link to="/login-/-signup" aria-label="Explore demo">
                <Button
                  variant="outline"
                  size="xl"
                  className="group transition-all duration-200 hover:scale-[1.02] hover:border-accent/50"
                >
                  <Sparkles className="mr-2 icon-md" aria-hidden />
                  Demo / Explore
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features - Bento grid */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-12" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 id="features-heading" className="text-center text-heading-section">
              Trustworthy automation, built in
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-body-lg">
              Multi-agent orchestration with explainability, fine-grained permissions, and
              enterprise-grade auditability.
            </p>
          </AnimatedSection>

          <div className="mt-section-gap grid gap-card sm:grid-cols-2 lg:grid-cols-3">
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
                    'group rounded-xl border border-border bg-card p-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/30',
                    feature.className
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent" aria-hidden>
                    <feature.icon className="icon-lg" />
                  </div>
                  <h3 className="mt-4 text-heading-card">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-body-sm">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-12" aria-labelledby="usecases-heading">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 id="usecases-heading" className="text-center text-heading-section">
              Built for how you work
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-body-lg">
              Whether you&apos;re a solo creator, team lead, or enterprise, LifeOps adapts to
              your workflow.
            </p>
          </AnimatedSection>

          <div className="mt-section-gap grid gap-card sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="rounded-xl border border-border bg-card p-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-purple/20 text-accent-purple" aria-hidden>
                    <uc.icon className="icon-lg" />
                  </div>
                  <h3 className="mt-4 text-heading-card">{uc.title}</h3>
                  <p className="mt-2 text-body-sm">{uc.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-12" aria-labelledby="templates-heading">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 id="templates-heading" className="text-center text-heading-section">
              Start with templates
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-body-lg">
              Pre-built workflows to get you running in minutes. Customize or create from
              scratch.
            </p>
          </AnimatedSection>

          <div className="mt-section-gap grid gap-card sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: FolderKanban, label: 'Project Sprint', desc: 'Tickets, PRs, releases', slug: 'project-sprint' },
              { icon: FileText, label: 'Content Pipeline', desc: 'Ideas → drafts → publish', slug: 'content-pipeline' },
              { icon: Wallet, label: 'Finance Review', desc: 'Categorize, forecast, close', slug: 'finance-review' },
              { icon: Heart, label: 'Health Tracker', desc: 'Habits, goals, recovery', slug: 'health-tracker' },
            ].map((t, i) => (
              <AnimatedSection key={t.label} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <Link
                  to={`/login-/-signup?template=${t.slug}`}
                  className="block rounded-xl border border-border bg-card p-card text-center transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`Start with ${t.label} template - ${t.desc}`}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent-blue/20 text-accent-blue" aria-hidden>
                    <t.icon className="icon-lg" />
                  </div>
                  <h3 className="mt-4 text-heading-card">{t.label}</h3>
                  <p className="mt-1 text-body-sm">{t.desc}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-12" aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 id="pricing-heading" className="text-center text-heading-section">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-body-lg">
              Start free. Scale as you grow. No hidden fees.
            </p>
          </AnimatedSection>

          <div className="mt-section-gap grid gap-card lg:grid-cols-3">
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
                    'relative rounded-xl border p-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1',
                    plan.highlighted
                      ? 'border-accent bg-accent/5 shadow-accent-glow'
                      : 'border-border bg-card hover:border-accent/30'
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                      <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
                      Most popular
                    </div>
                  )}
                  <h3 className={cn('text-heading-card', plan.highlighted && 'pt-2')}>{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-price font-bold text-foreground">{plan.price}</span>
                    <span className="text-body-sm">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3" aria-label={`${plan.name} plan features`}>
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-body-sm">
                        <Check className="icon-sm shrink-0 text-accent-green" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.name === 'Enterprise' ? (
                    <a href="mailto:sales@lifeops.example" className="block mt-8" aria-label="Contact sales for Enterprise plan">
                      <Button
                        variant={plan.highlighted ? 'default' : 'outline'}
                        className="w-full transition-all duration-200 hover:scale-[1.02]"
                      >
                        {plan.cta}
                      </Button>
                    </a>
                  ) : (
                    <Link to="/login-/-signup" className="block mt-8" aria-label={`${plan.cta} - ${plan.name} plan`}>
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
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-12" aria-labelledby="cta-heading">
        <AnimatedSection>
          <div className="gradient-border mx-auto max-w-4xl rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 hover:shadow-card-hover hover:shadow-accent-glow/50">
            <h2 id="cta-heading" className="text-heading-cta sm:text-heading-cta-lg font-bold text-foreground">
              Ready to automate with confidence?
            </h2>
            <p className="mt-4 text-body-lg">
              Join individuals, teams, and enterprises who trust LifeOps for their
              automation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/login-/-signup" aria-label="Sign up for free">
                <Button
                  size="xl"
                  className="animate-pulse-soft transition-all duration-200 hover:scale-[1.05] hover:shadow-accent-glow motion-reduce:animate-none"
                >
                  Sign up free
                </Button>
              </Link>
              <Link to="/login-/-signup" aria-label="Sign in to your account">
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
      <footer className="border-t border-border px-4 py-8 sm:px-6 sm:py-12 lg:px-12" role="contentinfo">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="icon-md text-accent" aria-hidden />
            <span className="font-medium text-foreground">LifeOps</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-body-sm" aria-label="Footer navigation">
            <Link
              to="/help"
              className="inline-flex items-center gap-2 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              aria-label="Get help"
            >
              <HelpCircle className="icon-sm" aria-hidden />
              Help
            </Link>
            <a
              href="mailto:sales@lifeops.example"
              className="inline-flex items-center gap-2 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              aria-label="Contact sales"
            >
              <Mail className="icon-sm" aria-hidden />
              Contact Sales
            </a>
            <Link to="/privacy" className="hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded" aria-label="Privacy policy">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded" aria-label="Terms of service">
              Terms
            </Link>
            <Link
              to="/cookies"
              className="inline-flex items-center gap-2 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              aria-label="Cookie policy"
            >
              <Cookie className="icon-sm" aria-hidden />
              Cookies
            </Link>
          </nav>
        </div>
      </footer>

      <CookieConsentBanner />
    </div>
  )
}
