import { Shield, Edit, CheckCircle, Play } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import type { Cronjob, CronjobPermission } from '@/types/cronjobs'

interface PermissionsMatrixProps {
  cronjob: Cronjob | null
  permissions?: CronjobPermission[]
  isLoading?: boolean
  onUpdatePermissions?: (permissions: CronjobPermission[]) => void
  readOnly?: boolean
}

export function PermissionsMatrix({
  cronjob,
  permissions = [],
  isLoading,
  onUpdatePermissions,
  readOnly,
}: PermissionsMatrixProps) {
  if (!cronjob && !isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">Select a cronjob to manage permissions</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  const togglePermission = (userId: string, key: 'can_edit' | 'can_approve' | 'can_run', value: boolean) => {
    const updated = permissions.map((p) =>
      p.user_id === userId ? { ...p, [key]: value } : p
    )
    if (!updated.find((p) => p.user_id === userId)) {
      updated.push({
        user_id: userId,
        can_edit: key === 'can_edit' ? value : false,
        can_approve: key === 'can_approve' ? value : false,
        can_run: key === 'can_run' ? value : false,
      })
    }
    onUpdatePermissions?.(updated)
  }

  const defaultPerms = permissions.length > 0 ? permissions : [
    { user_id: 'owner', can_edit: true, can_approve: true, can_run: true },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions Matrix</CardTitle>
        <CardDescription>Who can edit, approve, and run this cronjob</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                  User / Role
                </th>
                <th className="pb-3 text-center text-sm font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </span>
                </th>
                <th className="pb-3 text-center text-sm font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </span>
                </th>
                <th className="pb-3 text-center text-sm font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    Run
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {defaultPerms.map((p) => (
                <tr key={p.user_id} className="border-b border-border/50">
                  <td className="py-3 text-sm font-medium text-foreground">
                    {p.user_id === 'owner' ? 'Owner' : p.user_id}
                  </td>
                  <td className="py-3 text-center">
                    <Checkbox
                      checked={p.can_edit}
                      onCheckedChange={(v) => togglePermission(p.user_id, 'can_edit', !!v)}
                      disabled={readOnly}
                    />
                  </td>
                  <td className="py-3 text-center">
                    <Checkbox
                      checked={p.can_approve}
                      onCheckedChange={(v) => togglePermission(p.user_id, 'can_approve', !!v)}
                      disabled={readOnly}
                    />
                  </td>
                  <td className="py-3 text-center">
                    <Checkbox
                      checked={p.can_run}
                      onCheckedChange={(v) => togglePermission(p.user_id, 'can_run', !!v)}
                      disabled={readOnly}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
