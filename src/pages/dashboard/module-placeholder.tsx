import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ModulePlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
  features: string[]
}

export function ModulePlaceholder({ title, description, icon: Icon, features }: ModulePlaceholderProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10">
            <Icon className="h-10 w-10 text-accent" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-foreground">
            {title} Module
          </h3>
          <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
            This module is coming in Phase 3. Key features will include:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
          <Button className="mt-8">Get Notified</Button>
        </CardContent>
      </Card>
    </div>
  )
}
