import type { CartProps } from "@/components/composites/cart";
import { Paragraph } from "@pallas-ui/components/src/ui/typography";
import { memo } from "react";
import CartItemCard from "./ItemCard";

export type ItemCardsProps = Pick<
  CartProps,
  | "items"
  | "updateQuantity"
  | "availableDiscounts"
  | "availableTaxes"
  | "handleItemDiscountsChange"
  | "handleItemTaxesChange"
>;

const ItemCards = memo(function ItemCards({
  items,
  availableDiscounts,
  availableTaxes,
  updateQuantity,
  handleItemDiscountsChange,
  handleItemTaxesChange,
}: ItemCardsProps) {
  if (items.length === 0) {
    return (
      <Paragraph color="secondary" size="compact">
        Your cart is empty.
      </Paragraph>
    );
  }

  return (
    <>
      {items.map((item) => (
        <CartItemCard
          key={item.itemId + item.variationId}
          item={item}
          availableDiscounts={availableDiscounts}
          availableTaxes={availableTaxes}
          updateQuantity={updateQuantity}
          handleItemDiscountsChange={handleItemDiscountsChange}
          handleItemTaxesChange={handleItemTaxesChange}
        />
      ))}
    </>
  );
});

export default ItemCards;
