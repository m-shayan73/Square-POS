import { useCartStore } from '@/shared/providers'
import { clientApi } from '@/shared/services/clients/client-api'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { OnChangeValue } from 'react-select'
import { useShallow } from 'zustand/react/shallow'

import type {
  CartItem,
  Discount,
  DiscountOption,
  OrderCalculationResult,
  Tax,
  TaxOption,
} from '@/shared/types'

export function useHeader() {
  const router = useRouter()
  const { data: session } = useSession()

  const {
    openCartDrawer,
    setOpenCartDrawer,
    items,
    amounts,
    updateQuantity,
    handleItemDiscountsChange,
    handleItemTaxesChange,
    availableDiscounts,
    availableTaxes,
    globalDiscountsApplied,
    globalTaxesApplied,
    handleGlobalDiscountsChange,
    handleGlobalTaxesChange,
    clearCart,
    handleCheckout,
  } = useCart()

  function getInitials(name: string) {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
    return initials.slice(0, 2)
  }

  function handleLogoClick() {
    router.push('/home')
  }

  function handleSignOut() {
    signOut({ callbackUrl: '/' })
  }

  const initials = session?.user?.name ? getInitials(session.user.name) : ''

  return {
    initials,
    handleLogoClick,
    handleSignOut,
    openCartDrawer,
    setOpenCartDrawer,
    items,
    amounts,
    updateQuantity,
    handleItemDiscountsChange,
    handleItemTaxesChange,
    availableDiscounts,
    availableTaxes,
    globalDiscountsApplied,
    globalTaxesApplied,
    handleGlobalDiscountsChange,
    handleGlobalTaxesChange,
    clearCart,
    handleCheckout,
  }
}

function useCart() {
  const router = useRouter()
  const [openCartDrawer, setOpenCartDrawer] = useState(false)
  const { discounts: availableDiscounts } = getDiscounts()
  const { taxes: availableTaxes } = getTaxes()

  const {
    items,
    amounts,
    globalDiscountsApplied,
    globalTaxesApplied,
    updateQuantity,
    setItemDiscounts,
    setItemTaxes,
    setGlobalDiscounts,
    setGlobalTaxes,
    setCartAmounts,
    clearCart,
  } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      amounts: state.amounts,
      globalDiscountsApplied: state.globalDiscountsApplied,
      globalTaxesApplied: state.globalTaxesApplied,
      updateQuantity: state.updateQuantity,
      setItemDiscounts: state.setItemDiscounts,
      setItemTaxes: state.setItemTaxes,
      setGlobalDiscounts: state.setGlobalDiscounts,
      setGlobalTaxes: state.setGlobalTaxes,
      setCartAmounts: state.setCartAmounts,
      clearCart: state.clearCart,
    })),
  )

  const { orderCalculation, isOrderCalculationLoading } = useOrderCalculation(items)

  useEffect(() => {
    if (orderCalculation) {
      const { subtotal, totalTax, totalDiscount, netTotal, currency } = orderCalculation

      setCartAmounts({
        subtotal,
        totalTax,
        totalDiscount,
        netTotal,
        currency,
      })
    }
  }, [orderCalculation, setCartAmounts])

  const handleCheckout = () => {
    router.push('/checkout')
    setOpenCartDrawer(false)
  }

  // Transformed for react select
  const handleItemDiscountsChange = (
    itemId: string,
    variationId: string,
    newValue: OnChangeValue<DiscountOption, true>,
  ) => {
    const newDiscounts = newValue.map((option) => ({ id: option.value, name: option.label }))
    setItemDiscounts(itemId, variationId, newDiscounts)
  }

  function handleItemTaxesChange(
    itemId: string,
    variationId: string,
    newValue: OnChangeValue<TaxOption, true>,
  ) {
    const newTaxes = newValue.map((option) => ({ id: option.value, name: option.label }))
    setItemTaxes(itemId, variationId, newTaxes)
  }

  function handleGlobalDiscountsChange(newValue: OnChangeValue<DiscountOption, true>) {
    const newGlobalDiscounts = newValue.map((option) => ({
      id: option.value,
      name: option.label,
    }))
    setGlobalDiscounts(newGlobalDiscounts)
  }

  const handleGlobalTaxesChange = (newValue: OnChangeValue<TaxOption, true>) => {
    const newGlobalTaxes = newValue.map((option) => ({
      id: option.value,
      name: option.label,
    }))
    setGlobalTaxes(newGlobalTaxes)
  }

  const transformedItems = items.map((item) => ({
    ...item,
    discountsApplied: transformToReactSelectOptions(item.discountsApplied),
    taxesApplied: transformToReactSelectOptions(item.taxesApplied),
  }))
  const transformedAvailableDiscounts = transformToReactSelectOptions(availableDiscounts)
  const transformedAvailableTaxes = transformToReactSelectOptions(availableTaxes)
  const transformedGlobalDiscounts = transformToReactSelectOptions(globalDiscountsApplied)
  const transformedGlobalTaxes = transformToReactSelectOptions(globalTaxesApplied)

  return {
    openCartDrawer,
    setOpenCartDrawer,
    items: transformedItems,
    amounts,
    updateQuantity,
    handleItemDiscountsChange,
    handleItemTaxesChange,
    availableDiscounts: transformedAvailableDiscounts || [],
    availableTaxes: transformedAvailableTaxes || [],
    globalDiscountsApplied: transformedGlobalDiscounts || [],
    globalTaxesApplied: transformedGlobalTaxes || [],
    handleGlobalDiscountsChange,
    handleGlobalTaxesChange,
    handleCheckout,
    clearCart,
  }
}

export function getDiscounts(): { discounts: Discount[]; isLoadingDiscounts: boolean } {
  const { data: discounts, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ['discounts'],
    queryFn: async () => {
      const response = await clientApi.get('/api/pricing/discounts/list')
      return response.data
    },
  })

  return { discounts, isLoadingDiscounts }
}

export function getTaxes(): { taxes: Tax[]; isLoadingTaxes: boolean } {
  const { data: taxes, isLoading: isLoadingTaxes } = useQuery({
    queryKey: ['taxes'],
    queryFn: async () => {
      const response = await clientApi.get('/api/pricing/taxes/list')
      return response.data
    },
  })

  return { taxes, isLoadingTaxes }
}

export const useOrderCalculation = (
  items: CartItem[],
): {
  orderCalculation: OrderCalculationResult
  isOrderCalculationLoading: boolean
} => {
  const { data, isLoading } = useQuery<OrderCalculationResult>({
    queryKey: ['order-calculation', items],
    queryFn: async () => {
      if (items.length === 0) {
        return {
          subtotal: 0,
          totalTax: 0,
          totalDiscount: 0,
          netTotal: 0,
          currency: 'USD',
        } as OrderCalculationResult
      }

      const { data } = await clientApi.post('/api/orders/calculate', {
        items,
      })
      return data
    },
    refetchOnWindowFocus: false,
  })

  return {
    orderCalculation: data,
    isOrderCalculationLoading: isLoading,
  }
}

function transformToReactSelectOptions(
  items: { id: string; name: string }[],
): { value: string; label: string }[] {
  if (!items || items.length === 0) {
    return []
  }

  return items.map((item) => ({
    value: item.id,
    label: item.name,
  }))
}
