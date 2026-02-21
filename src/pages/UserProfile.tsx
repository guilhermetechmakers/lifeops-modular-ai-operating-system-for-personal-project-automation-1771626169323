import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'
import {
  ProfileCard,
  AccountSettings,
  Security,
  Integrations,
  APIKeys,
  BillingSummaryCTA,
  ActivityLog,
} from '@/components/user-profile'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useUserProfile,
  useUpdateUserProfile,
  useIntegrations,
  useConnectIntegration,
  useDisconnectIntegration,
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
  useRotateApiKey,
  useActiveSessions,
  useRevokeSession,
  useActivityLog,
} from '@/hooks/use-user-profile'
import type {
  UserProfile as UserProfileType,
  ActiveSession,
  ActivityLogEntry,
} from '@/types/user-profile'

const MOCK_PROFILE: UserProfileType = {
  id: 'mock-1',
  user_id: 'mock-user',
  title: 'Member',
  description: undefined,
  status: 'active',
  full_name: 'John Doe',
  avatar_url: undefined,
  role: 'Member',
  organization: 'Acme Inc',
  email: 'john@example.com',
  timezone: 'UTC',
  language: 'en',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}


const MOCK_SESSIONS: ActiveSession[] = [
  {
    id: 'current',
    device: 'Chrome on macOS',
    location: 'San Francisco, CA',
    last_active: new Date().toISOString(),
    current: true,
  },
]

const MOCK_ACTIVITY: ActivityLogEntry[] = [
  {
    id: '1',
    action: 'Login',
    resource: 'Dashboard',
    timestamp: new Date().toISOString(),
    ip_address: '192.168.1.1',
  },
  {
    id: '2',
    action: 'Update profile',
    resource: 'Account settings',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    action: 'Create API key',
    resource: 'Production API',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
]

export default function UserProfile() {
  const profileQuery = useUserProfile()
  const integrationsQuery = useIntegrations()
  const apiKeysQuery = useApiKeys()
  const sessionsQuery = useActiveSessions()
  const activityQuery = useActivityLog(10)

  const updateProfile = useUpdateUserProfile()
  const connectIntegration = useConnectIntegration()
  const disconnectIntegration = useDisconnectIntegration()
  const createApiKey = useCreateApiKey()
  const revokeApiKey = useRevokeApiKey()
  const rotateApiKey = useRotateApiKey()
  const revokeSession = useRevokeSession()

  const profile =
    profileQuery.data ??
    (profileQuery.isError ? MOCK_PROFILE : null)
  const integrations = integrationsQuery.data ?? []
  const apiKeys = apiKeysQuery.data ?? (apiKeysQuery.isError ? [] : [])
  const sessions =
    sessionsQuery.data ?? (sessionsQuery.isError ? MOCK_SESSIONS : [])
  const activity =
    activityQuery.data ?? (activityQuery.isError ? MOCK_ACTIVITY : [])

  const isLoading =
    profileQuery.isPending ||
    integrationsQuery.isPending ||
    apiKeysQuery.isPending ||
    sessionsQuery.isPending ||
    activityQuery.isPending

  const refetchAll = useCallback(() => {
    profileQuery.refetch()
    integrationsQuery.refetch()
    apiKeysQuery.refetch()
    sessionsQuery.refetch()
    activityQuery.refetch()
  }, [
    profileQuery,
    integrationsQuery,
    apiKeysQuery,
    sessionsQuery,
    activityQuery,
  ])

  const handleUpdateProfile = useCallback(
    async (
      updates: Parameters<typeof updateProfile.mutateAsync>[0]
    ) => {
      await updateProfile.mutateAsync(updates)
    },
    [updateProfile]
  )

  const handleConnectIntegration = useCallback(
    async (id: string) => {
      await connectIntegration.mutateAsync(id)
    },
    [connectIntegration]
  )

  const handleDisconnectIntegration = useCallback(
    async (id: string) => {
      await disconnectIntegration.mutateAsync(id)
    },
    [disconnectIntegration]
  )

  const handleCreateApiKey = useCallback(
    async (name: string, scope: string[]) => {
      return createApiKey.mutateAsync({ name, scope })
    },
    [createApiKey]
  )

  const handleRevokeApiKey = useCallback(
    async (id: string) => {
      await revokeApiKey.mutateAsync(id)
    },
    [revokeApiKey]
  )

  const handleRotateApiKey = useCallback(
    async (id: string) => {
      return rotateApiKey.mutateAsync(id)
    },
    [rotateApiKey]
  )

  const handleChangePassword = useCallback(
    async (_current: string, _newPassword: string) => {
      toast.info(
        'Password change requires authentication. Configure Supabase to enable.'
      )
    },
    []
  )

  const handleEnable2FA = useCallback(async () => {
    toast.info(
      '2FA setup requires authentication. Configure Supabase to enable.'
    )
  }, [])

  const handleRevokeSession = useCallback(
    async (id: string) => {
      await revokeSession.mutateAsync(id)
    },
    [revokeSession]
  )

  const handleRevokeTokens = useCallback(async () => {
    await revokeSession.mutateAsync('current')
    toast.info('All sessions revoked. You may need to sign in again.')
  }, [revokeSession])

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in" role="status" aria-label="Loading profile">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </nav>
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-96 max-w-full mt-2" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
        <span className="sr-only">Loading user profile...</span>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 animate-fade-in">
        <div className="flex flex-col items-center max-w-md text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Failed to load profile
          </h2>
          <p className="text-muted-foreground mt-2">
            We couldn&apos;t load your account data. Please check your
            connection and try again.
          </p>
          <button
            onClick={refetchAll}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-accent-glow"
            aria-label="Retry loading profile"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <nav
        className="flex items-center gap-2 text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link
          to="/dashboard"
          className="hover:text-foreground transition-colors"
          aria-label="Navigate to dashboard"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <span className="text-foreground font-medium">User Profile</span>
      </nav>

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
          User Profile
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Account center for personal info, security settings, integrations,
          billing, and API keys
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in-up [animation-delay:0.05s] [animation-fill-mode:both]">
          <ProfileCard
            name={profile?.full_name ?? profile?.email ?? 'User'}
            avatar={profile?.avatar_url}
            role={profile?.role ?? 'Member'}
            organization={profile?.organization}
            isLoading={isLoading}
          />
        </div>
        <div className="animate-fade-in-up [animation-delay:0.1s] [animation-fill-mode:both]">
          <AccountSettings
            name={profile?.full_name ?? ''}
            email={profile?.email ?? ''}
            timezone={profile?.timezone ?? 'UTC'}
            language={profile?.language ?? 'en'}
            onUpdate={handleUpdateProfile}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in-up [animation-delay:0.15s] [animation-fill-mode:both]">
          <Security
            twoFactorEnabled={false}
            sessions={sessions}
            onChangePassword={handleChangePassword}
            onEnable2FA={handleEnable2FA}
            onRevokeSession={handleRevokeSession}
            onRevokeTokens={handleRevokeTokens}
            isLoading={isLoading}
          />
        </div>
        <div className="animate-fade-in-up [animation-delay:0.2s] [animation-fill-mode:both]">
          <Integrations
            integrations={integrations}
            onConnect={handleConnectIntegration}
            onDisconnect={handleDisconnectIntegration}
            isLoading={isLoading}
            isError={integrationsQuery.isError}
            onRetry={() => integrationsQuery.refetch()}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in-up [animation-delay:0.25s] [animation-fill-mode:both]">
          <APIKeys
            apiKeys={apiKeys}
            onCreate={handleCreateApiKey}
            onRevoke={handleRevokeApiKey}
            onRotate={handleRotateApiKey}
            isLoading={isLoading}
          />
        </div>
        <div className="animate-fade-in-up [animation-delay:0.3s] [animation-fill-mode:both]">
          <BillingSummaryCTA planName="Pro" planAmount="$29/month" />
        </div>
      </div>

      <div className="animate-fade-in-up [animation-delay:0.35s] [animation-fill-mode:both]">
        <ActivityLog entries={activity} isLoading={isLoading} />
      </div>
    </div>
  )
}
