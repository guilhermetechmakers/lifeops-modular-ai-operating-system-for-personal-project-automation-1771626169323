import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Play, Power, Loader2 } from 'lucide-react'

interface SaveEnableRunNowButtonsProps {
  onSave?: () => void
  onEnable: () => void
  onRunNow: () => void
  isSubmitting?: boolean
  isRunning?: boolean
  isEnabled?: boolean
  canRunNow?: boolean
}

export function SaveEnableRunNowButtons({
  onEnable,
  onRunNow,
  isSubmitting,
  isRunning,
  isEnabled = true,
  canRunNow = true,
}: SaveEnableRunNowButtonsProps) {
  return (
    <Card className="sticky top-4 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
      <CardContent className="flex flex-col gap-3 p-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-full bg-gradient-to-r from-accent to-primary transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save
            </>
          )}
        </Button>
        <Button
          type="button"
          variant={isEnabled ? 'secondary' : 'default'}
          onClick={onEnable}
          disabled={isSubmitting}
          className="min-w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Power className="h-4 w-4" />
          {isEnabled ? 'Disable' : 'Enable'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onRunNow}
          disabled={!canRunNow || isRunning || isSubmitting}
          className="min-w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
