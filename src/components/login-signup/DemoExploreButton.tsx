import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface DemoExploreButtonProps {
  onDemo?: () => void
  disabled?: boolean
  className?: string
}

export function DemoExploreButton({
  onDemo,
  disabled = false,
  className,
}: DemoExploreButtonProps) {
  const navigate = useNavigate()

  async function handleDemo() {
    if (onDemo) {
      await onDemo()
    } else {
      // Default: create limited demo workspace and redirect
      // When Supabase is configured, this will call the Edge Function
      try {
        // TODO: Replace with supabase.functions.invoke('create-demo-workspace')
        await new Promise((r) => setTimeout(r, 600))
        navigate('/dashboard')
      } catch {
        // Error handled by caller
      }
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={handleDemo}
      className={cn(
        'w-full transition-all duration-200 hover:scale-[1.02] hover:border-accent/50 active:scale-[0.98]',
        className
      )}
    >
      <Sparkles className="h-4 w-4" />
      Demo / Explore
    </Button>
  )
}
