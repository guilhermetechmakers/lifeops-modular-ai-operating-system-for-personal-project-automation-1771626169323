import { useNavigate } from 'react-router-dom'
import { Bot, GitBranch, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export interface QuickCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const templates = [
  {
    id: 'agent',
    label: 'Create Agent',
    description: 'Define a new AI agent with capabilities',
    icon: Bot,
    to: '/dashboard/agents?create=1',
    gradient: 'from-accent to-primary',
  },
  {
    id: 'workflow',
    label: 'Create Workflow',
    description: 'Build a multi-step automation workflow',
    icon: GitBranch,
    to: '/dashboard/agents?workflow=1',
    gradient: 'from-accent-purple to-accent-blue',
  },
  {
    id: 'cronjob',
    label: 'Create Cronjob',
    description: 'Schedule a recurring job or task',
    icon: Clock,
    to: '/dashboard/cronjobs-dashboard?create=1',
    gradient: 'from-accent-blue to-accent-green',
  },
]

export function QuickCreateModal({ open, onOpenChange }: QuickCreateModalProps) {
  const navigate = useNavigate()

  const handleSelect = (to: string) => {
    onOpenChange(false)
    navigate(to)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showClose>
        <DialogHeader>
          <DialogTitle>Quick Create</DialogTitle>
          <DialogDescription>
            Create an agent, workflow, or cronjob template
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelect(t.to)}
              className={cn(
                'flex items-start gap-4 rounded-xl border border-border p-4 text-left transition-all duration-200',
                'hover:border-accent/50 hover:bg-secondary/50 hover:shadow-card-hover hover:-translate-y-0.5',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background'
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
                  t.gradient
                )}
              >
                <t.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{t.label}</p>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
