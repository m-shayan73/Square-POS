import { Paragraph } from "@/components/primitives/typography";
import type { CartItem } from "@/types/cart";
import type { Item } from "@/types/items";
import { Center, Grid } from "@styled-system/jsx";
import { memo } from "react";
import ItemCard from "./ItemCard";

type ItemCardsProps = {
  items: Item[];
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (
    itemId: string,
    variationId: string,
    quantity: number
  ) => void;
};

function ItemList({
  items,
  cartItems,
  addToCart,
  updateQuantity,
}: ItemCardsProps) {
  if (!items || items.length === 0) {
    return (
      <Center
        css={{
          height: "200px",
        }}
      >
        <Paragraph>No items found</Paragraph>
      </Center>
    );
  }

  return (
    <Grid
      columns={{ base: 1, sm: 2, xl: 3, "2xl": 4 }}
      gap={{ base: "gap.component.sm", lg: "gap.component.md" }}
    >
      {items.map((item: Item) => {
        // Pass all cart items for this item (all variations)
        const itemCartItems = cartItems.filter((ci) => ci.itemId === item.id);
        return (
          <ItemCard
            key={item.id}
            item={item}
            cartItems={itemCartItems}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
          />
        );
      })}
    </Grid>
  );
}

export default memo(ItemList);
