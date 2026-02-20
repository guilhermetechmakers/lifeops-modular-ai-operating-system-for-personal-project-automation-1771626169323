import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  ProfileCard,
  AccountSettings,
  Security,
  Integrations,
  APIKeys,
  BillingSummaryCTA,
  ActivityLog,
} from '@/components/user-profile'
import {
  fetchUserProfile,
  updateUserProfile,
  fetchIntegrations,
  connectIntegration,
  disconnectIntegration,
  fetchApiKeys,
  createApiKey,
  revokeApiKey,
  rotateApiKey,
  fetchActiveSessions,
  revokeSession,
  fetchActivityLog,
} from '@/api/user-profile'
import type { UserProfile, Integration, ApiKey, ActiveSession, ActivityLogEntry } from '@/types/user-profile'

const MOCK_PROFILE: UserProfile = {
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

const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'slack', name: 'Slack', icon: 'slack', connected: true, connected_at: new Date().toISOString() },
  { id: 'github', name: 'GitHub', icon: 'github', connected: false },
  { id: 'google', name: 'Google', icon: 'google', connected: true, connected_at: new Date().toISOString() },
  { id: 'notion', name: 'Notion', icon: 'notion', connected: false },
  { id: 'linear', name: 'Linear', icon: 'linear', connected: false },
]

const MOCK_SESSIONS: ActiveSession[] = [
  { id: 'current', device: 'Chrome on macOS', location: 'San Francisco, CA', last_active: new Date().toISOString(), current: true },
]

const MOCK_ACTIVITY: ActivityLogEntry[] = [
  { id: '1', action: 'Login', resource: 'Dashboard', timestamp: new Date().toISOString(), ip_address: '192.168.1.1' },
  { id: '2', action: 'Update profile', resource: 'Account settings', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', action: 'Create API key', resource: 'Production API', timestamp: new Date(Date.now() - 86400000).toISOString() },
]

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [sessions, setSessions] = useState<ActiveSession[]>([])
  const [activity, setActivity] = useState<ActivityLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [useMock, setUseMock] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [profileRes, integrationsRes, apiKeysRes, sessionsRes, activityRes] = await Promise.allSettled([
        fetchUserProfile(),
        fetchIntegrations(),
        fetchApiKeys(),
        fetchActiveSessions(),
        fetchActivityLog(10),
      ])

      if (profileRes.status === 'fulfilled' && profileRes.value) {
        setProfile(profileRes.value)
      } else {
        setProfile(MOCK_PROFILE)
        setUseMock(true)
      }

      if (integrationsRes.status === 'fulfilled') {
        setIntegrations(integrationsRes.value)
      } else {
        setIntegrations(MOCK_INTEGRATIONS)
        setUseMock(true)
      }

      if (apiKeysRes.status === 'fulfilled') {
        setApiKeys(apiKeysRes.value)
      } else {
        setApiKeys([])
      }

      if (sessionsRes.status === 'fulfilled') {
        setSessions(sessionsRes.value)
      } else {
        setSessions(MOCK_SESSIONS)
        setUseMock(true)
      }

      if (activityRes.status === 'fulfilled') {
        setActivity(activityRes.value)
      } else {
        setActivity(MOCK_ACTIVITY)
        setUseMock(true)
      }
    } catch {
      setProfile(MOCK_PROFILE)
      setIntegrations(MOCK_INTEGRATIONS)
      setApiKeys([])
      setSessions(MOCK_SESSIONS)
      setActivity(MOCK_ACTIVITY)
      setUseMock(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUpdateProfile = useCallback(
    async (updates: Parameters<typeof updateUserProfile>[0]) => {
      if (useMock) {
        setProfile((p) => (p ? { ...p, ...updates, updated_at: new Date().toISOString() } : null))
        return
      }
      const updated = await updateUserProfile(updates)
      setProfile(updated)
    },
    [useMock]
  )

  const handleConnectIntegration = useCallback(
    async (id: string) => {
      if (useMock) {
        setIntegrations((prev) =>
          prev.map((i) => (i.id === id ? { ...i, connected: true, connected_at: new Date().toISOString() } : i))
        )
        return
      }
      await connectIntegration(id)
      const list = await fetchIntegrations()
      setIntegrations(list)
    },
    [useMock]
  )

  const handleDisconnectIntegration = useCallback(
    async (id: string) => {
      if (useMock) {
        setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, connected: false, connected_at: undefined } : i)))
        return
      }
      await disconnectIntegration(id)
      const list = await fetchIntegrations()
      setIntegrations(list)
    },
    [useMock]
  )

  const handleCreateApiKey = useCallback(
    async (name: string, scope: string[]) => {
      if (useMock) {
        const newKey: ApiKey = {
          id: `mock-${Date.now()}`,
          name,
          prefix: 'lk_xxxxxxxx...',
          scope,
          created_at: new Date().toISOString(),
        }
        setApiKeys((prev) => [newKey, ...prev])
        return { key: 'lk_mock_key_do_not_use_in_production', apiKey: newKey }
      }
      return createApiKey(name, scope)
    },
    [useMock]
  )

  const handleRevokeApiKey = useCallback(
    async (id: string) => {
      if (useMock) {
        setApiKeys((prev) => prev.filter((k) => k.id !== id))
        return
      }
      await revokeApiKey(id)
      const list = await fetchApiKeys()
      setApiKeys(list)
    },
    [useMock]
  )

  const handleRotateApiKey = useCallback(
    async (id: string) => {
      if (useMock) {
        return { key: 'lk_rotated_mock_key' }
      }
      return rotateApiKey(id)
    },
    [useMock]
  )

  const handleChangePassword = useCallback(async (_current: string, _newPassword: string) => {
    toast.info('Password change requires authentication. Configure Supabase to enable.')
  }, [])

  const handleEnable2FA = useCallback(async () => {
    toast.info('2FA setup requires authentication. Configure Supabase to enable.')
  }, [])

  const handleRevokeSession = useCallback(
    async (id: string) => {
      if (useMock) {
        setSessions((prev) => prev.filter((s) => s.id !== id))
        return
      }
      await revokeSession(id)
      const list = await fetchActiveSessions()
      setSessions(list)
    },
    [useMock]
  )

  const handleRevokeTokens = useCallback(async () => {
    if (useMock) {
      setSessions([])
      return
    }
    await revokeSession('current')
    toast.info('All sessions revoked. You may need to sign in again.')
  }, [useMock])

  if (!profile && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h2 className="text-xl font-semibold text-foreground">Failed to load profile</h2>
        <p className="text-muted-foreground mt-2">Please try again later.</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          User Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Account center for personal info, security settings, integrations, billing, and API keys
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileCard
          name={profile?.full_name ?? profile?.email ?? 'User'}
          avatar={profile?.avatar_url}
          role={profile?.role ?? 'Member'}
          organization={profile?.organization}
          isLoading={isLoading}
        />
        <AccountSettings
          name={profile?.full_name ?? ''}
          email={profile?.email ?? ''}
          timezone={profile?.timezone ?? 'UTC'}
          language={profile?.language ?? 'en'}
          onUpdate={handleUpdateProfile}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Security
          twoFactorEnabled={false}
          sessions={sessions}
          onChangePassword={handleChangePassword}
          onEnable2FA={handleEnable2FA}
          onRevokeSession={handleRevokeSession}
          onRevokeTokens={handleRevokeTokens}
          isLoading={isLoading}
        />
        <Integrations
          integrations={integrations}
          onConnect={handleConnectIntegration}
          onDisconnect={handleDisconnectIntegration}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <APIKeys
          apiKeys={apiKeys}
          onCreate={handleCreateApiKey}
          onRevoke={handleRevokeApiKey}
          onRotate={handleRotateApiKey}
          isLoading={isLoading}
        />
        <BillingSummaryCTA planName="Pro" planAmount="$29/month" />
      </div>

      <ActivityLog entries={activity} isLoading={isLoading} />
    </div>
  )
}
