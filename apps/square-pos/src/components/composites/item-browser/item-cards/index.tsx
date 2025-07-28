import type { Item } from "@/shared/types/items";
import type { CartItem } from "@/shared/types/cart";
import { Paragraph } from "@pallas-ui/components/src/ui/typography";
import { Flex, Grid } from "@styled-system/jsx";
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
      <Flex
        css={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Paragraph>No items found</Paragraph>
      </Flex>
    );
  }

  return (
    <Grid
      columns={{ base: 1, sm: 2, lg: 3, xl: 4, "2xl": 5 }}
      gap={{ base: "gap.component.md", sm: "gap.component.lg" }}
    >
      {items.map((item: Item) => {
        return <ItemCard key={item.id} item={item} addToCart={addToCart} />;
      })}
    </Grid>
  );
}

export default memo(ItemCards);
