import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Play, Power } from 'lucide-react'

interface SaveEnableRunNowButtonsProps {
  onSave: () => void
  onEnable: () => void
  onRunNow: () => void
  isSubmitting?: boolean
  isRunning?: boolean
  isEnabled?: boolean
  canRunNow?: boolean
}

export function SaveEnableRunNowButtons({
  onSave: _onSave,
  onEnable,
  onRunNow,
  isSubmitting,
  isRunning,
  isEnabled = true,
  canRunNow = true,
}: SaveEnableRunNowButtonsProps) {
  return (
    <Card className="sticky top-4 transition-shadow duration-300 hover:shadow-card">
      <CardContent className="flex flex-wrap gap-3 p-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity min-w-[120px]"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save
            </>
          )}
        </Button>
        <Button
          variant={isEnabled ? 'secondary' : 'default'}
          onClick={onEnable}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          <Power className="h-4 w-4" />
          {isEnabled ? 'Disable' : 'Enable'}
        </Button>
        <Button
          variant="outline"
          onClick={onRunNow}
          disabled={!canRunNow || isRunning || isSubmitting}
          className="min-w-[120px]"
        >
          {isRunning ? (
            <span className="animate-pulse">Running...</span>
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
