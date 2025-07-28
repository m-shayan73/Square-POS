import Drawer from "@/components/composites/drawer";
import type { DiscountOption, TaxOption, CartItem } from "@/shared/types";
import { Button } from "@pallas-ui/components/src/ui/button";
import { Heading, Paragraph } from "@pallas-ui/components/src/ui/typography";
import { Box, Flex, Grid, HStack, VStack } from "@styled-system/jsx";
import type React from "react";
import { memo } from "react";
import Select, { type OnChangeValue } from "react-select";
import CartIcon from "./CartIcon";
import CartTotals from "./CartTotals";
import ItemCards from "./item-cards";

interface ModifiedItem
  extends Omit<CartItem, "discountsApplied" | "taxesApplied"> {
  discountsApplied: DiscountOption[];
  taxesApplied: TaxOption[];
}

export interface CartProps {
  openCartDrawer: boolean;
  setOpenCartDrawer: (open: boolean) => void;
  items: ModifiedItem[];
  amounts: {
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    netTotal: number;
    currency: string;
  };
  isOrderCalculationLoading?: boolean;
  availableDiscounts: DiscountOption[];
  availableTaxes: TaxOption[];
  globalDiscountsApplied: DiscountOption[];
  globalTaxesApplied: TaxOption[];
  handleGlobalDiscountsChange: (
    newValue: OnChangeValue<DiscountOption, true>
  ) => void;
  handleGlobalTaxesChange: (newValue: OnChangeValue<TaxOption, true>) => void;
  handleItemDiscountsChange: (
    itemId: string,
    variationId: string,
    newValue: OnChangeValue<DiscountOption, true>
  ) => void;
  handleItemTaxesChange: (
    itemId: string,
    variationId: string,
    newValue: OnChangeValue<TaxOption, true>
  ) => void;
  updateQuantity: (
    itemId: string,
    variationId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  handleCheckout: () => void;
}

const Cart = memo(function Cart({
  openCartDrawer,
  setOpenCartDrawer,
  items,
  amounts,
  isOrderCalculationLoading,
  availableDiscounts,
  availableTaxes,
  globalDiscountsApplied,
  globalTaxesApplied,
  handleGlobalDiscountsChange,
  handleGlobalTaxesChange,
  handleItemDiscountsChange,
  handleItemTaxesChange,
  updateQuantity,
  clearCart,
  handleCheckout,
}: CartProps) {
  const itemCount = items.length;

  return (
    <>
      <CartIcon setOpen={setOpenCartDrawer} itemCount={itemCount} />

      <Drawer open={openCartDrawer} onClose={() => setOpenCartDrawer(false)}>
        <VStack gap="gap.component.lg" align="stretch" flex="1">
          <Heading level={5}>Your Cart</Heading>

          <VStack flex="1" gap="gap.component.md">
            <ItemCards
              items={items}
              updateQuantity={updateQuantity}
              availableDiscounts={availableDiscounts}
              availableTaxes={availableTaxes}
              handleItemDiscountsChange={handleItemDiscountsChange}
              handleItemTaxesChange={handleItemTaxesChange}
            />
          </VStack>

          <Grid
            gridTemplateColumns="auto 1fr"
            gap="gap.inline.sm"
            textStyle="sm"
            alignItems="flex-end"
          >
            <Paragraph size="compact">Discounts:</Paragraph>
            <Select
              isMulti={true}
              options={availableDiscounts}
              placeholder="Apply discount"
              isClearable={true}
              value={globalDiscountsApplied}
              onChange={handleGlobalDiscountsChange}
              isDisabled={items.length === 0}
            />

            <Paragraph size="compact">Taxes:</Paragraph>
            <Select
              isMulti={true}
              options={availableTaxes}
              placeholder="Apply tax"
              isClearable={true}
              value={globalTaxesApplied}
              onChange={handleGlobalTaxesChange}
              isDisabled={items.length === 0}
            />
          </Grid>

          <CartTotals
            amounts={amounts}
            isOrderCalculationLoading={isOrderCalculationLoading}
          />

          <Flex gap="gap.inline.sm" justify="space-between">
            <Button
              variant="outlined"
              onClick={clearCart}
              disabled={itemCount === 0}
            >
              Clear Cart
            </Button>
            <Button
              variant="primary"
              disabled={itemCount === 0}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </Flex>
        </VStack>
      </Drawer>
    </>
  );
});

export default Cart;
