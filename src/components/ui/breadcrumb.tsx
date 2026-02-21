import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buildBreadcrumbs } from '@/lib/navigation'

export interface BreadcrumbProps {
  className?: string
  /** Override breadcrumbs; if not provided, builds from current pathname */
  items?: { label: string; href: string }[]
}

export function Breadcrumb({ className, items: customItems }: BreadcrumbProps) {
  const location = useLocation()
  const items = customItems ?? buildBreadcrumbs(location.pathname)

  if (items.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-sm text-muted-foreground', className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <ChevronRight
                className="h-4 w-4 shrink-0 text-muted-foreground/60"
                aria-hidden
              />
            )}
            {isLast ? (
              <span
                className="font-medium text-foreground truncate max-w-[180px] sm:max-w-none"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="truncate max-w-[120px] sm:max-w-[180px] hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
