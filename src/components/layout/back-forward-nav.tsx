import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface BackForwardNavProps {
  className?: string
}

/**
 * Back and forward navigation controls using browser history.
 * Buttons are always shown; browser handles no-op when no history.
 */
export function BackForwardNav({ className }: BackForwardNavProps) {
  const navigate = useNavigate()

  return (
    <div
      className={cn('flex items-center gap-0.5 rounded-lg border border-border bg-secondary/50 p-0.5', className)}
      role="group"
      aria-label="Back and forward navigation"
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="h-8 w-8 rounded-md"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => navigate(1)}
        aria-label="Go forward"
        className="h-8 w-8 rounded-md"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
