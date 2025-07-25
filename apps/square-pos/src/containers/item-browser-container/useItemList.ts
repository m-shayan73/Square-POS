import { clientApi } from '@/shared/services/clients/client-api'
import type { SearchFilters, SearchParams } from '@/shared/types'
import { searchItems } from '@/shared/utils/query-options'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { queryOptions } from '@tanstack/react-query'
import { debounce } from 'lodash'
import { useMemo, useState } from 'react'

export function useItemList() {
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const { filters, debouncedFilters, ...filterHelpers } = useFilters()

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value)
      }, 300),
    [],
  )

  const handleSetSearch = (value: string) => {
    setSearch(value)
    debouncedSetSearch(value)
  }

  const { items, isLoading } = useItemsSearch(debouncedSearch, debouncedFilters)

  return {
    search,
    setSearch: handleSetSearch,
    filters,
    ...filterHelpers,
    items,
    isLoading,
  }
}

function useFilters() {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>({})

  const debouncedSetFilters = useMemo(
    () =>
      debounce((newFilters: SearchFilters) => {
        setDebouncedFilters(newFilters)
      }, 500),
    [],
  )

  const handleFilterIconClick = () => {
    setFilterDrawerOpen(true)
  }

  const handleFilterCloseDrawer = () => {
    setFilterDrawerOpen(false)
  }

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters }

    if (field === 'minPrice' || field === 'maxPrice') {
      newFilters[field] = value === '' ? undefined : Number(value)
    } else if (field === 'sortBy') {
      newFilters.sortBy = value as 'default' | 'name' | 'price'
      if (value === 'default') {
        newFilters.sortOrder = undefined // Clear sortOrder if sortBy is default
      } else if (!newFilters.sortOrder) {
        // If sortBy is set, and sortOrder is not set, default to ASC
        newFilters.sortOrder = 'ASC'
      }
    } else if (field === 'sortOrder') {
      newFilters.sortOrder = value as 'ASC' | 'DESC'
    }

    setFilters(newFilters)
    debouncedSetFilters(newFilters)
  }

  const handleResetFilters = () => {
    const resetFilters = {
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'default' as const, // Set to 'default' string for UI display
      sortOrder: undefined,
    }
    setFilters(resetFilters)
  }

  return {
    filterDrawerOpen,
    filters,
    debouncedFilters,
    handleFilterIconClick,
    handleFilterCloseDrawer,
    handleFilterChange,
    handleResetFilters,
  }
}

function useItemsSearch(search: string, filters: SearchFilters) {
  const trimmedSearch = search.trim().length > 1 ? search.trim() : ''

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['items', trimmedSearch, filters],
    queryFn: async () => {
      const searchParams: SearchParams = {
        search: trimmedSearch,
        filters: filters,
      }

      const response = await clientApi.post('api/items/search', searchParams)

      const items = response.data

      return items
    },
    staleTime: 1000 * 60 * 5,
  })

  return { items: data || [], isLoading }
}
