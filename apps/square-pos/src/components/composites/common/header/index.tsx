import Cart from '@/components/composites/cart'
import type { CartProps } from '@/components/composites/cart'
import { css } from '@styled-system/css'
import { Box, HStack } from '@styled-system/jsx'
import { memo } from 'react'
import AvatarMenu from './AvatarMenu'
import Logo from './Logo'

type HeaderProps = CartProps & {
  initials: string
  handleLogoClick: () => void
  handleSignOut: () => void
}

const headerStyles = css({
  bg: 'surface.elevated',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'gap.component.sm',
  height: 'header',
  padding: 'padding.block.3xl',
  borderBottom: 'thin',
  borderColor: 'border',
  position: 'sticky',
  top: '0',
  zIndex: '50',
})

const Header = memo(function Header({
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
}: HeaderProps) {
  return (
    <HStack className={headerStyles}>
      <Box>
        <Logo handleLogoClick={handleLogoClick} />
      </Box>

      <HStack gap="gap.inline.sm">
        <AvatarMenu initials={initials} onSignOut={handleSignOut} />
        <Cart
          openCartDrawer={openCartDrawer}
          setOpenCartDrawer={setOpenCartDrawer}
          cartDrawerRef={cartDrawerRef}
          openOrderToast={openOrderToast}
          setOpenOrderToast={setOpenOrderToast}
          items={items}
          amounts={amounts}
          isOrderCalculationLoading={isOrderCalculationLoading}
          availableDiscounts={availableDiscounts}
          availableTaxes={availableTaxes}
          globalDiscountsApplied={globalDiscountsApplied}
          globalTaxesApplied={globalTaxesApplied}
          handleGlobalDiscountsChange={handleGlobalDiscountsChange}
          handleGlobalTaxesChange={handleGlobalTaxesChange}
          handleItemDiscountsChange={handleItemDiscountsChange}
          handleItemTaxesChange={handleItemTaxesChange}
          clearCart={clearCart}
          handleCheckout={handleCheckout}
          updateQuantity={updateQuantity}
        />
      </HStack>
    </HStack>
  )
})

export default Header
