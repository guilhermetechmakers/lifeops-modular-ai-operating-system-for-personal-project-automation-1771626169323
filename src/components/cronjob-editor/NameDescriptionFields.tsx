import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { FileText } from 'lucide-react'

export interface NameDescriptionFormValues {
  name: string
  description?: string
}

interface NameDescriptionFieldsProps {
  register: UseFormRegister<NameDescriptionFormValues>
  errors: FieldErrors<NameDescriptionFormValues>
  disabled?: boolean
}

export function NameDescriptionFields({
  register,
  errors,
  disabled,
}: NameDescriptionFieldsProps) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-card-hover">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <FileText className="icon-md text-accent" aria-hidden />
          <div>
            <CardTitle>Name & Description</CardTitle>
            <CardDescription>
              Identify your cronjob with a clear name and optional description
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="space-y-2">
          <Label htmlFor="cronjob-name">Name</Label>
          <Input
            id="cronjob-name"
            placeholder="e.g. Daily Content Sync"
            aria-label="Cronjob name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'cronjob-name-error' : undefined}
            className={cn(
              'transition-all duration-200 focus:ring-accent/50',
              errors.name && 'border-destructive focus-visible:ring-destructive/50'
            )}
            disabled={disabled}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <p
              id="cronjob-name-error"
              className="text-sm text-destructive animate-fade-in"
              role="alert"
            >
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cronjob-description">Description (optional)</Label>
          <Input
            id="cronjob-description"
            placeholder="e.g. Sync content from external sources daily"
            aria-label="Cronjob description (optional)"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'cronjob-description-error' : undefined}
            className={cn(
              'transition-all duration-200',
              errors.description && 'border-destructive focus-visible:ring-destructive/50'
            )}
            disabled={disabled}
            {...register('description')}
          />
          {errors.description && (
            <p
              id="cronjob-description-error"
              className="text-sm text-destructive animate-fade-in"
              role="alert"
            >
              {errors.description.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
