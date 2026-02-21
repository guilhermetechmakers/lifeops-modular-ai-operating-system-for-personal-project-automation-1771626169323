import { useMutation } from '@tanstack/react-query'
import {
  search,
  type SearchParams,
  type SearchResponse,
} from '@/services/search-engine-service'

export const SEARCH_ENGINE_MUTATION_KEY = ['search-engine'] as const

export function useSearch() {
  return useMutation<SearchResponse, Error, SearchParams>({
    mutationKey: SEARCH_ENGINE_MUTATION_KEY,
    mutationFn: (params) => search(params),
  })
}
