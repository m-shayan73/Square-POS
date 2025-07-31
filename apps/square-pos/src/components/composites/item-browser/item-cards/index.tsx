import type { Item } from "@/shared/types/items";
import type { CartItem } from "@/shared/types/cart";
import { Paragraph } from "@pallas-ui/components/src/ui/typography";
import { Center, Grid } from "@styled-system/jsx";
import ItemCard from "./ItemCard";
import { memo } from "react";

type ItemCardsProps = {
  items: Item[];
  addToCart: (item: CartItem) => void;
};

function ItemCards({ items, addToCart }: ItemCardsProps) {
  // console.log('Rendering ItemCards', items)

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
        return <ItemCard key={item.id} item={item} addToCart={addToCart} />;
      })}
    </Grid>
  );
}

export default memo(ItemCards);
