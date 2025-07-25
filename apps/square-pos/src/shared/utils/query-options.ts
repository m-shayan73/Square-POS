import apiClient from '@/shared/services/clients/client-api'
import type { SearchFilters, SearchParams } from '@/shared/services/pos/pos.interface'
import type { CartItem } from '@/shared/types/cart'
import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'

export function searchItems(search: string, filters: SearchFilters) {
  return queryOptions({
    queryKey: ['items', search, filters],
    queryFn: async () => {
      const searchParams: SearchParams = {
        search: search || undefined,
        filters: filters,
      }

      const response = await apiClient.post('/api/items/search', searchParams)
      const items = response.data

      return items || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const getDiscounts = queryOptions({
  queryKey: ['discounts'],
  queryFn: async () => {
    const response = await apiClient.get('/api/pricing/discounts/list', {})
    return response.data
  },
  refetchOnWindowFocus: false,
})

export const getTaxes = queryOptions({
  queryKey: ['taxes'],
  queryFn: async () => {
    const response = await apiClient.get('/api/pricing/taxes/list', {})
    return response.data
  },
  refetchOnWindowFocus: false,
})

export function calculateOrder(items: CartItem[]) {
  return queryOptions({
    queryKey: ['order-calculation', items],
    queryFn: async () => {
      if (items.length === 0) {
        return {
          subtotal: 0,
          totalTax: 0,
          totalDiscount: 0,
          netTotal: 0,
          currency: 'USD',
        }
      }

      const response = await apiClient.post('/api/orders/calculate', { items })
      return response.data
    },
    refetchOnWindowFocus: false,
  })
}
