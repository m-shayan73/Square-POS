import type { Discount, Tax } from './cart'
import type { SearchFilters } from './items'

export interface OrderItem {
  itemId: string
  variationId: string
  quantity: number
  discountsApplied?: Discount[]
  taxesApplied?: Tax[]
}

export interface SearchParams {
  search?: string
  filters?: SearchFilters
}

export interface CalculateOrderParams {
  items: OrderItem[]
  globalDiscounts?: string[] // IDs
  globalTaxes?: string[] // IDs
}

export interface OrderCalculationResult {
  subtotal: number
  totalTax: number
  totalDiscount: number
  netTotal: number
  currency: string
}