import type { Image } from "./items"

export interface Discount {
  id: string
  name: string
}

export interface Tax {
  id: string
  name: string
}

export interface CartItem {
  itemId: string
  variationId: string
  itemName: string
  variationName: string
  price: number
  quantity: number
  image?: Image
  discountsApplied: Discount[]
  taxesApplied: Tax[]
}