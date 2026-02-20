import { Play, Pause, Copy, Download, Trash2, Pencil, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Cronjob } from '@/types/cronjobs'

interface CronjobActionsProps {
  cronjob: Cronjob | null
  onRunNow?: (id: string) => void
  onPause?: (id: string) => void
  onClone?: (cronjob: Cronjob) => void
  onExport?: (cronjob: Cronjob) => void
  onDelete?: (id: string) => void
  onEdit?: (cronjob: Cronjob) => void
  isRunning?: boolean
}

export function CronjobActions({
  cronjob,
  onRunNow,
  onPause,
  onClone,
  onExport,
  onDelete,
  onEdit,
  isRunning,
}: CronjobActionsProps) {
  if (!cronjob) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground text-center">Select a cronjob to perform actions</p>
        </CardContent>
      </Card>
    )
  }

  const handleExport = () => {
    const blob = new Blob(
      [JSON.stringify({ ...cronjob, id: undefined, user_id: undefined, created_at: undefined, updated_at: undefined }, null, 2)],
      { type: 'application/json' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cronjob-${cronjob.name.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
    onExport?.(cronjob)
  }

  return (
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Run now, pause, clone, export, delete</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => onRunNow?.(cronjob.id)}
            disabled={isRunning || cronjob.status === 'paused'}
            className="bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Now
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPause?.(cronjob.id)}
          >
            <Pause className="mr-2 h-4 w-4" />
            {cronjob.status === 'paused' ? 'Resume' : 'Pause'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(cronjob)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onClone?.(cronjob)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Clone
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete?.(cronjob.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
