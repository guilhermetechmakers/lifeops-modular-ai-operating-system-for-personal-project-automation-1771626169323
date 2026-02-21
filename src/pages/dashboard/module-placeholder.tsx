import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
interface ModulePlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
  features: string[]
  /** Optional CTA to schedule runs (e.g. for Finance: link to cronjobs) */
  scheduleCta?: { label: string; to: string }
}

export function ModulePlaceholder({ title, description, icon: Icon, features, scheduleCta }: ModulePlaceholderProps) {
  const hasFeatures = features.length > 0

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-heading-section text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-body-lg">
          {description}
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-accent/10">
            <Icon className="h-6 w-6 text-accent" aria-hidden />
          </div>
          <h2 className="mt-6 text-heading-card text-foreground">
            {title} Module
          </h2>
          <p className="mt-2 max-w-md text-center text-body-sm">
            This module is coming in Phase 3. Key features will include:
          </p>

          {hasFeatures ? (
            <ul className="mt-4 space-y-2 text-body-sm" role="list">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/30 px-6 py-8 text-center">
              <Layers className="h-8 w-8 text-muted-foreground" aria-hidden />
              <div>
                <p className="font-medium text-foreground">No features listed yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Feature details will be added as this module is developed.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {scheduleCta && (
              <Button
                asChild
                className="bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity duration-200"
              >
                <Link to={scheduleCta.to}>{scheduleCta.label}</Link>
              </Button>
            )}
            <Button variant="outline">Get Notified</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
