import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Play, Power, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SaveEnableRunNowButtonsProps {
  onSave?: () => void
  onEnable: () => void
  onRunNow: () => void
  isSubmitting?: boolean
  isEnabling?: boolean
  isRunning?: boolean
  isEnabled?: boolean
  canRunNow?: boolean
}

export function SaveEnableRunNowButtons({
  onEnable,
  onRunNow,
  isSubmitting,
  isEnabling,
  isRunning,
  isEnabled = true,
  canRunNow = true,
}: SaveEnableRunNowButtonsProps) {
  const isEnableLoading = isEnabling ?? isSubmitting

  return (
    <Card className="sticky top-4">
      <CardContent className="flex flex-col gap-3 p-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'min-w-full transition-all duration-200',
            'bg-gradient-to-r from-accent to-primary text-primary-foreground',
            'hover:opacity-90 hover:scale-[1.02] hover:shadow-accent-glow',
            'active:scale-[0.98] focus-visible:ring-ring'
          )}
          aria-label={isSubmitting ? 'Saving cronjob' : 'Save cronjob'}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" aria-hidden />
              Save
            </>
          )}
        </Button>
        <Button
          type="button"
          variant={isEnabled ? 'secondary' : 'default'}
          onClick={onEnable}
          disabled={isEnableLoading}
          className="min-w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          aria-label={
            isEnableLoading
              ? isEnabled
                ? 'Disabling cronjob'
                : 'Enabling cronjob'
              : isEnabled
                ? 'Disable cronjob'
                : 'Enable cronjob'
          }
          aria-busy={isEnableLoading}
        >
          {isEnableLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {isEnabled ? 'Disabling...' : 'Enabling...'}
            </>
          ) : (
            <>
              <Power className="h-4 w-4" aria-hidden />
              {isEnabled ? 'Disable' : 'Enable'}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onRunNow}
          disabled={!canRunNow || isRunning || isSubmitting}
          className="min-w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          aria-label={
            isRunning
              ? 'Running cronjob'
              : canRunNow
                ? 'Run cronjob now'
                : 'Run cronjob now (unavailable)'
          }
          aria-busy={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden />
              Run Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
