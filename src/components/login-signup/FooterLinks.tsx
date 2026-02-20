import { Link } from 'react-router-dom'
import { HelpCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FooterLinksProps {
  className?: string
}

export function FooterLinks({ className }: FooterLinksProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground',
        className
      )}
    >
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
        <Phone className="h-4 w-4" />
        Contact Sales
      </a>
    </div>
  )
}
