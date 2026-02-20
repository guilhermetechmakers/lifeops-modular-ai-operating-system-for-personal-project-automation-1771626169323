import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProfileCardProps {
  name: string
  avatar?: string | null
  role: string
  organization?: string | null
  isLoading?: boolean
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function ProfileCard({ name, avatar, role, organization, isLoading, className }: ProfileCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden transition-all duration-300 hover:shadow-card-hover', className)}>
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>Your account information and role</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={avatar ?? undefined} alt={name} />
            <AvatarFallback className="bg-accent/20 text-accent text-lg">
              {name ? getInitials(name) : <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{name || 'Unknown'}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary" className="font-normal">
                {role || 'Member'}
              </Badge>
              {organization && (
                <span className="text-sm text-muted-foreground truncate">{organization}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
