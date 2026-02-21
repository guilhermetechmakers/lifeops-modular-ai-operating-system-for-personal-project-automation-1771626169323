import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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

export const userProfileKeys = {
  all: ['user-profile'] as const,
  profile: () => [...userProfileKeys.all, 'profile'] as const,
  integrations: () => [...userProfileKeys.all, 'integrations'] as const,
  apiKeys: () => [...userProfileKeys.all, 'api-keys'] as const,
  sessions: () => [...userProfileKeys.all, 'sessions'] as const,
  activity: (limit?: number) =>
    [...userProfileKeys.all, 'activity', limit] as const,
}

export function useUserProfile() {
  return useQuery({
    queryKey: userProfileKeys.profile(),
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(userProfileKeys.profile(), updated)
      toast.success('Account settings updated')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update settings')
    },
  })
}

export function useIntegrations() {
  return useQuery({
    queryKey: userProfileKeys.integrations(),
    queryFn: fetchIntegrations,
    staleTime: 1000 * 60 * 5,
  })
}

export function useConnectIntegration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: connectIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileKeys.integrations() })
      toast.success('Integration connected')
    },
    onError: () => toast.error('Failed to connect'),
  })
}

export function useDisconnectIntegration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: disconnectIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileKeys.integrations() })
      toast.success('Integration disconnected')
    },
    onError: () => toast.error('Failed to disconnect'),
  })
}

export function useApiKeys() {
  return useQuery({
    queryKey: userProfileKeys.apiKeys(),
    queryFn: fetchApiKeys,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name, scope }: { name: string; scope: string[] }) =>
      createApiKey(name, scope),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileKeys.apiKeys() })
    },
    onError: () => toast.error('Failed to create API key'),
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileKeys.apiKeys() })
      toast.success('API key revoked')
    },
    onError: () => toast.error('Failed to revoke API key'),
  })
}

export function useRotateApiKey() {
  return useMutation({
    mutationFn: rotateApiKey,
    onError: () => toast.error('Failed to rotate API key'),
  })
}

export function useActiveSessions() {
  return useQuery({
    queryKey: userProfileKeys.sessions(),
    queryFn: fetchActiveSessions,
    staleTime: 1000 * 60 * 2,
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileKeys.sessions() })
      toast.success('Session revoked')
    },
    onError: () => toast.error('Failed to revoke session'),
  })
}

export function useActivityLog(limit = 10) {
  return useQuery({
    queryKey: userProfileKeys.activity(limit),
    queryFn: () => fetchActivityLog(limit),
    staleTime: 1000 * 60 * 2,
  })
}
