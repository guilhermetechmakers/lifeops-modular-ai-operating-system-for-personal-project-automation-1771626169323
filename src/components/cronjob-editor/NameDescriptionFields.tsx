import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <Card className="transition-shadow duration-300 hover:shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" />
          <div>
            <CardTitle>Name & Description</CardTitle>
            <CardDescription>
              Identify your cronjob with a clear name and optional description
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cronjob-name">Name</Label>
          <Input
            id="cronjob-name"
            placeholder="e.g. Daily Content Sync"
            className="transition-all duration-200 focus:border-accent/50"
            disabled={disabled}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <p className="text-sm text-red-400 animate-fade-in">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cronjob-description">Description (optional)</Label>
          <Input
            id="cronjob-description"
            placeholder="e.g. Sync content from external sources daily"
            className="transition-all duration-200 focus:border-accent/50"
            disabled={disabled}
            {...register('description')}
          />
        </div>
      </CardContent>
    </Card>
  )
}
