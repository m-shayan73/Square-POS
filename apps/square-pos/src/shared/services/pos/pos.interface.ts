import type { Item } from '@/shared/types/items'
import type { SearchParams } from '@/shared/types/services'
import type { Discount, Tax } from '@/shared/types/cart'
import type { OrderCalculationResult, CalculateOrderParams } from '@/shared/types/services'

export interface IPosService {
  listItems(): Promise<Item[]>
  searchItems(params: SearchParams): Promise<Item[]>
  listDiscounts(): Promise<Discount[]>
  listTaxes(): Promise<Tax[]>
  calculateOrder(params: CalculateOrderParams): Promise<OrderCalculationResult>
}
