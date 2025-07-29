'use client'

import { useHeader } from './useHeader'
import Header from '@/components/composites/common/header'

export function HeaderContainer() {
  const {
    initials,
    handleLogoClick,
    handleSignOut,
    openCartDrawer,
    setOpenCartDrawer,
    cartDrawerRef,
    openOrderToast,
    setOpenOrderToast,
    items,
    amounts,
    isOrderCalculationLoading,
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
  } = useHeader()

  return (
    <Header
      initials={initials}
      handleLogoClick={handleLogoClick}
      handleSignOut={handleSignOut}
      openCartDrawer={openCartDrawer}
      setOpenCartDrawer={setOpenCartDrawer}
      cartDrawerRef={cartDrawerRef}
      openOrderToast={openOrderToast}
      setOpenOrderToast={setOpenOrderToast}
      items={items}
      updateQuantity={updateQuantity}
      amounts={amounts}
      isOrderCalculationLoading={isOrderCalculationLoading}
      handleItemDiscountsChange={handleItemDiscountsChange}
      handleItemTaxesChange={handleItemTaxesChange}
      availableDiscounts={availableDiscounts}
      availableTaxes={availableTaxes}
      globalDiscountsApplied={globalDiscountsApplied}
      globalTaxesApplied={globalTaxesApplied}
      handleGlobalDiscountsChange={handleGlobalDiscountsChange}
      handleGlobalTaxesChange={handleGlobalTaxesChange}
      handleCheckout={handleCheckout}
      clearCart={clearCart}
    />
  )
}
