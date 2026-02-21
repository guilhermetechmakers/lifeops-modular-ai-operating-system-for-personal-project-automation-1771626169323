import { useState, useCallback } from 'react'
import { Users, Shield, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState, ErrorState } from '@/components/ui/loading-states'
import { toast } from 'sonner'

export function AdminDashboard() {
  const [isError, setIsError] = useState<Record<string, boolean>>({
    users: false,
    audit: false,
    policy: false,
  })
  const [users] = useState<unknown[]>([])
  const [auditLogs] = useState<unknown[]>([])
  const [policies] = useState<unknown[]>([])

  const handleRetry = useCallback((tab: 'users' | 'audit' | 'policy') => {
    setIsError((prev) => ({ ...prev, [tab]: false }))
    toast.success('Retry completed')
  }, [])

  const handleContactSales = useCallback(() => {
    toast.info('Contact Sales – Enterprise plan required')
  }, [])

  const handleExportLogs = useCallback(() => {
    toast.info('Export logs – Compliance export available')
  }, [])

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="px-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Enterprise operations and policy controls
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
        <TabsList className="flex w-full flex-wrap gap-1 sm:inline-flex sm:w-auto">
          <TabsTrigger
            value="users"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Users className="h-4 w-4 shrink-0" aria-hidden />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <FileText className="h-4 w-4 shrink-0" aria-hidden />
            <span>Audit Logs</span>
          </TabsTrigger>
          <TabsTrigger
            value="policy"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Shield className="h-4 w-4 shrink-0" aria-hidden />
            <span>Policy Controls</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage organization members and roles</CardDescription>
            </CardHeader>
            <CardContent>
              {isError.users ? (
                <ErrorState
                  title="Failed to load users"
                  message="Unable to fetch users. Please check your connection and try again."
                  onRetry={() => handleRetry('users')}
                  retryLabel="Retry"
                />
              ) : users.length === 0 ? (
                <EmptyState
                  icon={Users}
                  heading="No users yet"
                  description="User management requires an enterprise plan. Add organization members and manage roles once upgraded."
                  actionLabel="Contact Sales"
                  onAction={handleContactSales}
                />
              ) : (
                <div className="rounded-xl border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
                  User list would render here when data is available.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>System Audit Logs</CardTitle>
              <CardDescription>Immutable trail of all actions</CardDescription>
            </CardHeader>
            <CardContent>
              {isError.audit ? (
                <ErrorState
                  title="Failed to load audit logs"
                  message="Unable to fetch audit logs. Please check your connection and try again."
                  onRetry={() => handleRetry('audit')}
                  retryLabel="Retry"
                />
              ) : auditLogs.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  heading="No audit logs yet"
                  description="Audit logs are available for compliance export. No activity has been recorded yet."
                  actionLabel="Export Logs"
                  onAction={handleExportLogs}
                />
              ) : (
                <div className="rounded-xl border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
                  Audit log list would render here when data is available.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>Policy Controls</CardTitle>
              <CardDescription>SAML/SCIM, data residency, spend caps</CardDescription>
            </CardHeader>
            <CardContent>
              {isError.policy ? (
                <ErrorState
                  title="Failed to load policy controls"
                  message="Unable to fetch policy controls. Please check your connection and try again."
                  onRetry={() => handleRetry('policy')}
                  retryLabel="Retry"
                />
              ) : policies.length === 0 ? (
                <EmptyState
                  icon={Shield}
                  heading="No policy controls yet"
                  description="Policy controls (SAML/SCIM, data residency, spend caps) require an enterprise plan."
                  actionLabel="Contact Sales"
                  onAction={handleContactSales}
                />
              ) : (
                <div className="rounded-xl border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
                  Policy list would render here when data is available.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
