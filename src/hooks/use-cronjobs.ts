import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCronjobs,
  fetchCronjob,
  fetchCronjobRuns,
  createCronjob,
  updateCronjob,
  deleteCronjob,
  runCronjobNow,
} from '@/api/cronjobs'
import type { Cronjob, CronjobRun } from '@/types/cronjobs'

export const CRONJOBS_QUERY_KEY = ['cronjobs'] as const
export const CRONJOB_QUERY_KEY = (id: string) => ['cronjob', id] as const
export const CRONJOB_RUNS_QUERY_KEY = (cronjobId: string) =>
  ['cronjob-runs', cronjobId] as const

export function useCronjobs() {
  return useQuery({
    queryKey: CRONJOBS_QUERY_KEY,
    queryFn: fetchCronjobs,
  })
}

export function useCronjob(id: string | null) {
  return useQuery({
    queryKey: CRONJOB_QUERY_KEY(id ?? ''),
    queryFn: () => fetchCronjob(id!),
    enabled: !!id,
  })
}

export function useCronjobRuns(cronjobId: string | null) {
  return useQuery({
    queryKey: CRONJOB_RUNS_QUERY_KEY(cronjobId ?? ''),
    queryFn: () => fetchCronjobRuns(cronjobId!),
    enabled: !!cronjobId,
  })
}

export function useCreateCronjob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cronjob: Omit<Cronjob, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
      createCronjob(cronjob),
    onSuccess: (data) => {
      queryClient.setQueryData<Cronjob[]>(CRONJOBS_QUERY_KEY, (prev) =>
        prev ? [data, ...prev] : [data]
      )
    },
  })
}

export function useUpdateCronjob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      cronjob,
    }: {
      id: string
      cronjob: Partial<Omit<Cronjob, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
    }) => updateCronjob(id, cronjob),
    onSuccess: (data) => {
      queryClient.setQueryData<Cronjob[]>(CRONJOBS_QUERY_KEY, (prev) =>
        prev ? prev.map((c) => (c.id === data.id ? data : c)) : [data]
      )
      queryClient.setQueryData(CRONJOB_QUERY_KEY(data.id), data)
    },
  })
}

export function useDeleteCronjob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCronjob(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Cronjob[]>(CRONJOBS_QUERY_KEY, (prev) =>
        prev ? prev.filter((c) => c.id !== id) : []
      )
    },
  })
}

export function useRunCronjobNow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => runCronjobNow(id),
    onSuccess: (run: CronjobRun) => {
      queryClient.invalidateQueries({ queryKey: CRONJOB_RUNS_QUERY_KEY(run.cronjob_id) })
    },
  })
}
