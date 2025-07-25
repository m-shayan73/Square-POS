export interface Discount {
  id: string
  name: string
}

export interface Tax {
  id: string
  name: string
}

export type CartItem = {
  itemId: string
  variationId: string
  itemName: string
  variationName: string
  price: number
  quantity: number
  imageUrl?: string
  discountsApplied: Discount[]
  taxesApplied: Tax[]
}