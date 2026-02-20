import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMasterDashboardData,
  approveItem,
  rejectItem,
  toggleCronjob,
  type MasterDashboardData,
} from '@/api/master-dashboard'

export const MASTER_DASHBOARD_QUERY_KEY = ['master-dashboard'] as const

export function useMasterDashboard() {
  return useQuery({
    queryKey: MASTER_DASHBOARD_QUERY_KEY,
    queryFn: fetchMasterDashboardData,
  })
}

export function useApproveItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveItem(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<MasterDashboardData>(MASTER_DASHBOARD_QUERY_KEY, (prev) =>
        prev
          ? {
              ...prev,
              approvals: prev.approvals.filter((a) => a.id !== id),
              overview: {
                ...prev.overview,
                pendingApprovals: Math.max(0, prev.overview.pendingApprovals - 1),
              },
            }
          : prev
      )
    },
  })
}

export function useRejectItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rejectItem(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<MasterDashboardData>(MASTER_DASHBOARD_QUERY_KEY, (prev) =>
        prev
          ? {
              ...prev,
              approvals: prev.approvals.filter((a) => a.id !== id),
              overview: {
                ...prev.overview,
                pendingApprovals: Math.max(0, prev.overview.pendingApprovals - 1),
              },
            }
          : prev
      )
    },
  })
}

export function useToggleCronjob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => toggleCronjob(id, enabled),
    onSuccess: (_, { id, enabled }) => {
      queryClient.setQueryData<MasterDashboardData>(MASTER_DASHBOARD_QUERY_KEY, (prev) =>
        prev
          ? {
              ...prev,
              activeCronjobs: prev.activeCronjobs.map((c) =>
                c.id === id ? { ...c, enabled } : c
              ),
            }
          : prev
      )
    },
  })
}
