import { useState } from 'react'
import {
  Settings,
  Building2,
  Shield,
  Plug,
  Bell,
  Save,
  Link2,
  Loader2,
  Lock,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, ErrorState } from '@/components/ui/loading-states'
import { cn } from '@/lib/utils'

export interface IntegrationItem {
  id: string
  name: string
  connected?: boolean
}

export interface SettingsPageProps {
  integrations?: IntegrationItem[]
  isLoadingIntegrations?: boolean
  hasIntegrationsError?: boolean
  onRetryIntegrations?: () => void
}

const DEFAULT_INTEGRATIONS: IntegrationItem[] = [
  { id: 'github', name: 'GitHub', connected: false },
  { id: 'slack', name: 'Slack', connected: false },
  { id: 'jira', name: 'Jira', connected: false },
  { id: 'plaid', name: 'Plaid', connected: false },
]

function IntegrationListSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading integrations">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border p-4"
        >
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function SettingsPage({
  integrations = DEFAULT_INTEGRATIONS,
  isLoadingIntegrations = false,
  hasIntegrationsError = false,
  onRetryIntegrations,
}: SettingsPageProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const showIntegrationsEmpty = integrations.length === 0 && !isLoadingIntegrations && !hasIntegrationsError

  const handleSaveOrg = async () => {
    setIsSaving(true)
    setSaveError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsSaving(false)
    } catch {
      setSaveError('Failed to save changes. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <header className="flex flex-col gap-2 sm:gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
            aria-hidden
          >
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage your organization and preferences
            </p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="org" className="space-y-6">
        <TabsList
          className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto lg:inline-grid lg:grid-cols-4"
          role="tablist"
          aria-label="Settings sections"
        >
          <TabsTrigger value="org" aria-label="Organization settings">
            <Building2 className="mr-2 h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Organization</span>
            <span className="sm:hidden">Org</span>
          </TabsTrigger>
          <TabsTrigger value="security" aria-label="Security and compliance settings">
            <Shield className="mr-2 h-4 w-4 shrink-0" aria-hidden />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" aria-label="Connected integrations">
            <Plug className="mr-2 h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Integrations</span>
            <span className="sm:hidden">Apps</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" aria-label="Notification preferences">
            <Bell className="mr-2 h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="org" className="space-y-6">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" aria-hidden />
                Organization
              </CardTitle>
              <CardDescription>Your organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {saveError && (
                <ErrorState
                  title="Save failed"
                  message={saveError}
                  onRetry={() => setSaveError(null)}
                  retryLabel="Dismiss"
                  retryAriaLabel="Dismiss error message"
                  className="py-6"
                />
              )}
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization name</Label>
                <Input
                  id="org-name"
                  placeholder="Acme Inc"
                  defaultValue="Acme Inc"
                  aria-describedby="org-name-hint"
                />
                <p id="org-name-hint" className="text-xs text-muted-foreground sr-only">
                  Enter your organization display name
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-slug">Slug</Label>
                <Input
                  id="org-slug"
                  placeholder="acme"
                  defaultValue="acme"
                  aria-describedby="org-slug-hint"
                />
                <p id="org-slug-hint" className="text-xs text-muted-foreground sr-only">
                  URL-friendly identifier for your organization
                </p>
              </div>
              <Button
                onClick={handleSaveOrg}
                disabled={isSaving}
                className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                aria-label={isSaving ? 'Saving changes' : 'Save organization changes'}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" aria-hidden />
                    Save changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" aria-hidden />
                Security & Compliance
              </CardTitle>
              <CardDescription>Data residency and retention policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={cn(
                  'flex flex-col gap-4 rounded-lg border border-border p-4 transition-all duration-200',
                  'sm:flex-row sm:items-center sm:justify-between',
                  'hover:border-border/80 hover:shadow-sm'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary"
                    aria-hidden
                  >
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Two-factor authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch
                  aria-label="Enable two-factor authentication"
                  aria-describedby="2fa-desc"
                />
              </div>
              <p id="2fa-desc" className="sr-only">
                Toggle to enable or disable two-factor authentication for your account
              </p>
              <div
                className={cn(
                  'flex flex-col gap-4 rounded-lg border border-border p-4 transition-all duration-200',
                  'sm:flex-row sm:items-center sm:justify-between',
                  'hover:border-border/80 hover:shadow-sm'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary"
                    aria-hidden
                  >
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Session timeout</p>
                    <p className="text-sm text-muted-foreground">
                      Auto-logout after 24h of inactivity
                    </p>
                  </div>
                </div>
                <Switch
                  defaultChecked
                  aria-label="Enable session timeout after 24 hours of inactivity"
                  aria-describedby="session-desc"
                />
              </div>
              <p id="session-desc" className="sr-only">
                Toggle to enable or disable automatic logout after 24 hours of inactivity
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-muted-foreground" aria-hidden />
                Integrations
              </CardTitle>
              <CardDescription>Connected services and connectors</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingIntegrations ? (
                <IntegrationListSkeleton />
              ) : hasIntegrationsError ? (
                <ErrorState
                  title="Failed to load integrations"
                  message="We couldn't load your integrations. Please try again."
                  onRetry={onRetryIntegrations}
                  retryLabel="Retry"
                  retryAriaLabel="Retry loading integrations"
                />
              ) : showIntegrationsEmpty ? (
                <EmptyState
                  icon={Plug}
                  heading="No integrations yet"
                  description="Connect your favorite tools to automate workflows and sync data."
                  actionLabel="Browse integrations"
                  onAction={() => {}}
                />
              ) : (
                <div className="space-y-4">
                  {integrations.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'flex flex-col gap-4 rounded-lg border border-border p-4 transition-all duration-200',
                        'sm:flex-row sm:items-center sm:justify-between',
                        'hover:border-border/80 hover:shadow-sm'
                      )}
                    >
                      <span className="font-medium text-foreground">{item.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        aria-label={item.connected ? `Disconnect ${item.name}` : `Connect ${item.name}`}
                      >
                        <Link2 className="mr-2 h-4 w-4" aria-hidden />
                        {item.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" aria-hidden />
                Notification Preferences
              </CardTitle>
              <CardDescription>How you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={cn(
                  'flex flex-col gap-4 rounded-lg border border-border p-4 transition-all duration-200',
                  'sm:flex-row sm:items-center sm:justify-between',
                  'hover:border-border/80 hover:shadow-sm'
                )}
              >
                <div>
                  <p className="font-medium text-foreground">Approval requests</p>
                  <p className="text-sm text-muted-foreground">In-app and email</p>
                </div>
                <Switch
                  defaultChecked
                  aria-label="Receive approval requests via in-app and email"
                />
              </div>
              <div
                className={cn(
                  'flex flex-col gap-4 rounded-lg border border-border p-4 transition-all duration-200',
                  'sm:flex-row sm:items-center sm:justify-between',
                  'hover:border-border/80 hover:shadow-sm'
                )}
              >
                <div>
                  <p className="font-medium text-foreground">Run failures</p>
                  <p className="text-sm text-muted-foreground">Immediate notification</p>
                </div>
                <Switch
                  defaultChecked
                  aria-label="Receive immediate notification when runs fail"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
