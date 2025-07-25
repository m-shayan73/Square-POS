import type { Discount, Tax } from '@/shared/services/pos/pos.interface'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import type { CartItem } from '../types/cart'

type CartState = {
  items: CartItem[]
  globalDiscountsApplied: Discount[]
  globalTaxesApplied: Tax[]
  amounts: {
    subtotal: number
    totalTax: number
    totalDiscount: number
    netTotal: number
    currency: string
  }
}

type CartActions = {
  setItems: (items: CartItem[]) => void
  addItem: (item: CartItem) => void
  removeItem: (itemId: string, variationId: string) => void
  updateQuantity: (itemId: string, variationId: string, quantity: number) => void
  setItemDiscounts: (itemId: string, variationId: string, discounts: Discount[]) => void
  setItemTaxes: (itemId: string, variationId: string, taxes: Tax[]) => void
  clearCart: () => void
  setGlobalDiscounts: (discounts: Discount[]) => void
  setGlobalTaxes: (taxes: Tax[]) => void
  setCartAmounts: ({
    subtotal,
    totalTax,
    totalDiscount,
    netTotal,
    currency,
  }: {
    subtotal: number
    totalTax: number
    totalDiscount: number
    netTotal: number
    currency: string
  }) => void
}

export type CartStore = CartState & CartActions

export const defaultInitState: CartState = {
  items: [],
  globalDiscountsApplied: [],
  globalTaxesApplied: [],
  amounts: {
    subtotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    netTotal: 0,
    currency: 'USD',
  },
}

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setItems: (items: CartItem[]) => {
          const currentGlobalDiscounts = get().globalDiscountsApplied
          const currentGlobalTaxes = get().globalTaxesApplied

          const { commonDiscounts, commonTaxes, discountsChanged, taxesChanged } =
            recalculateGlobals(items, currentGlobalDiscounts, currentGlobalTaxes)

          set({
            items,
            ...(discountsChanged && { globalDiscountsApplied: commonDiscounts }),
            ...(taxesChanged && { globalTaxesApplied: commonTaxes }),
          })
        },
        addItem: (item: CartItem) => {
          set((state) => {
            let updatedItems: CartItem[]
            const existingItem = state.items.find(
              (i) => i.itemId === item.itemId && i.variationId === item.variationId,
            )

            if (existingItem) {
              updatedItems = state.items.map((i) =>
                i.itemId === item.itemId && i.variationId === item.variationId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              )
            } else {
              updatedItems = [...state.items, item]
            }

            const { commonDiscounts, commonTaxes, discountsChanged, taxesChanged } =
              recalculateGlobals(
                updatedItems,
                state.globalDiscountsApplied,
                state.globalTaxesApplied,
              )

            return {
              items: updatedItems,
              ...(discountsChanged && { globalDiscountsApplied: commonDiscounts }),
              ...(taxesChanged && { globalTaxesApplied: commonTaxes }),
            }
          })
        },
        removeItem: (itemId: string, variationId: string) => {
          set((state) => {
            const updatedItems = state.items.filter(
              (i) => !(i.itemId === itemId && i.variationId === variationId),
            )

            const { commonDiscounts, commonTaxes, discountsChanged, taxesChanged } =
              recalculateGlobals(
                updatedItems,
                state.globalDiscountsApplied,
                state.globalTaxesApplied,
              )

            return {
              items: updatedItems,
              ...(discountsChanged && { globalDiscountsApplied: commonDiscounts }),
              ...(taxesChanged && { globalTaxesApplied: commonTaxes }),
            }
          })
        },
        updateQuantity: (itemId: string, variationId: string, quantity: number) => {
          if (quantity === 0) {
            get().removeItem(itemId, variationId)
            return
          }

          set((state) => {
            const updatedItems = state.items.map((item) =>
              item.itemId === itemId && item.variationId === variationId
                ? { ...item, quantity }
                : item,
            )

            const { commonDiscounts, commonTaxes, discountsChanged, taxesChanged } =
              recalculateGlobals(
                updatedItems,
                state.globalDiscountsApplied,
                state.globalTaxesApplied,
              )

            return {
              items: updatedItems,
              ...(discountsChanged && { globalDiscountsApplied: commonDiscounts }),
              ...(taxesChanged && { globalTaxesApplied: commonTaxes }),
            }
          })
        },
        setItemDiscounts: (itemId: string, variationId: string, discounts: Discount[]) => {
          set((state) => {
            const updatedItems = state.items.map((item) =>
              item.itemId === itemId && item.variationId === variationId
                ? { ...item, discountsApplied: discounts }
                : item,
            )

            const { commonDiscounts, commonTaxes, discountsChanged, taxesChanged } =
              recalculateGlobals(
                updatedItems,
                state.globalDiscountsApplied,
                state.globalTaxesApplied,
              )

            return {
              items: updatedItems,
              ...(discountsChanged && { globalDiscountsApplied: commonDiscounts }),
              ...(taxesChanged && { globalTaxesApplied: commonTaxes }),
            }
          })
        },
        setItemTaxes: (itemId: string, variationId: string, taxes: Tax[]) => {
          set((state) => {
            const updatedItems = state.items.map((item) =>
              item.itemId === itemId && item.variationId === variationId
                ? { ...item, taxesApplied: taxes }
                : item,
            )

            const { commonDiscounts, commonTaxes, discountsChanged, taxesChanged } =
              recalculateGlobals(
                updatedItems,
                state.globalDiscountsApplied,
                state.globalTaxesApplied,
              )

            return {
              items: updatedItems,
              ...(discountsChanged && { globalDiscountsApplied: commonDiscounts }),
              ...(taxesChanged && { globalTaxesApplied: commonTaxes }),
            }
          })
        },
        clearCart: () => set({ items: [], globalDiscountsApplied: [], globalTaxesApplied: [] }),
        setGlobalDiscounts: (newGlobalDiscounts: Discount[]) => {
          const previousGlobalDiscounts = get().globalDiscountsApplied
          const itemsWithUpdatedDiscounts = get().items.map((item) => {
            // updatedItemDiscounts = itemSpecificDiscounts + newGlobalDiscounts
            const newItemDiscounts = [
              ...item.discountsApplied.filter(
                (d) =>
                  !previousGlobalDiscounts.some((nd) => nd.id === d.id) &&
                  !newGlobalDiscounts.some((ng) => ng.id === d.id),
              ),
              ...newGlobalDiscounts,
            ]

            return { ...item, discountsApplied: newItemDiscounts }
          })

          set({ globalDiscountsApplied: newGlobalDiscounts, items: itemsWithUpdatedDiscounts })
        },
        setGlobalTaxes: (newGlobalTaxes: Tax[]) => {
          const previousGlobalTaxes = get().globalTaxesApplied
          const itemsWithUpdatedTaxes = get().items.map((item) => {
            const newItemTaxes = [
              ...item.taxesApplied.filter(
                (t) =>
                  !previousGlobalTaxes.some((nt) => nt.id === t.id) &&
                  !newGlobalTaxes.some((ng) => ng.id === t.id),
              ),
              ...newGlobalTaxes,
            ]

            return { ...item, taxesApplied: newItemTaxes }
          })
          set({ globalTaxesApplied: newGlobalTaxes, items: itemsWithUpdatedTaxes })
        },
        setCartAmounts: ({ subtotal, netTotal, totalTax, totalDiscount, currency }) => {
          set({
            amounts: {
              totalTax: totalTax,
              totalDiscount: totalDiscount,
              netTotal: netTotal,
              subtotal: subtotal,
              currency: currency,
            },
          })
        },
      }),
      {
        name: 'cart',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  )
}

const recalculateGlobals = (
  items: CartItem[],
  currentGlobalDiscounts: Discount[],
  currentGlobalTaxes: Tax[],
) => {
  let commonDiscounts: Discount[] = []
  let commonTaxes: Tax[] = []

  if (items.length > 0) {
    commonDiscounts = items[0].discountsApplied.filter((discount) =>
      items.every((item) =>
        item.discountsApplied.some((itemDiscount) => itemDiscount.id === discount.id),
      ),
    )

    commonTaxes = items[0].taxesApplied.filter((tax) =>
      items.every((item) => item.taxesApplied.some((itemTax) => itemTax.id === tax.id)),
    )
  }

  const discountsChanged =
    commonDiscounts.length !== currentGlobalDiscounts.length ||
    !commonDiscounts.every((d) => currentGlobalDiscounts.some((cd) => cd.id === d.id))

  const taxesChanged =
    commonTaxes.length !== currentGlobalTaxes.length ||
    !commonTaxes.every((t) => currentGlobalTaxes.some((ct) => ct.id === t.id))

  return { commonDiscounts, commonTaxes, discountsChanged, taxesChanged }
}
