import { Button } from "@/components/primitives/button";
import { DecorativeBox } from "@/components/primitives/decorative-box/DecorativeBox";
import Select from "@/components/primitives/select";
import { ImageSkeleton } from "@/components/primitives/skeleton";
import { Paragraph } from "@/components/primitives/typography";
import { formatMoney } from "@/utils/helpers";
import { Box, HStack, VStack } from "@styled-system/jsx";
import { myCard } from "@styled-system/recipes";
import NextImage from "next/image";
import React, { memo } from "react";
import { Plus, Minus } from "lucide-react";

import type { CartItem } from "@/types/cart";
import type { Item } from "@/types/items";

type ItemCardProps = {
  item: Item;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (
    itemId: string,
    variationId: string,
    quantity: number
  ) => void;
};

function propsAreEqual(prev: ItemCardProps, next: ItemCardProps) {
  return (
    prev.item.id === next.item.id &&
    prev.cartItems.length === next.cartItems.length &&
    prev.cartItems.every(
      (prevItem, index) =>
        prevItem.itemId === next.cartItems[index].itemId &&
        prevItem.variationId === next.cartItems[index].variationId &&
        prevItem.quantity === next.cartItems[index].quantity
    )
  );
}

function ItemCard({
  item,
  cartItems,
  addToCart,
  updateQuantity,
}: ItemCardProps) {
  const [selectedVariationId, setSelectedVariationId] = React.useState(
    item.variations?.[0]?.id || ""
  );

  // In square, each item must have a single variation. (also, price data is inside variation)
  if (!item.variations || item.variations.length === 0) {
    return null;
  }

  // get the variation object (to display price / add item) as per the selected variation id
  const selectedVariation = item.variations?.find(
    (v) => v.id === selectedVariationId
  );

  // Find the cart item for the selected variation
  const selectedCartItem = cartItems.find(
    (ci) => ci.variationId === selectedVariationId
  );

  // get the primary image for the item
  // if the selected variation has an image, use that; otherwise, use the item's
  let image = item.images?.[0] ? item.images[0] : undefined;

  if (selectedVariation?.images?.[0]) {
    image = selectedVariation.images[0];
  }

  const isActive = !!selectedCartItem;

  const card = myCard({ active: isActive });

  return (
    <Box className={card.root}>
      <VStack className={card.body}>
        <HStack align="flex-start" gap="gap.inline.md">
          <Box
            className={card.image}
            flexShrink={0}
            width={{ base: "100px", md: "130px" }}
            minHeight={{ base: "100px", md: "130px" }}
            position="relative"
          >
            {image ? (
              <NextImage
                src={image.url || ""}
                alt={image.name || ""}
                fill={true}
                sizes="(max-width: 640px) 100px, 130px"
              />
            ) : (
              <DecorativeBox>
                <ImageSkeleton imageIconSize={60} />
              </DecorativeBox>
            )}
          </Box>

          <VStack flex={1} justifyContent="space-between" height="full">
            <VStack gap="0">
              <Paragraph
                truncate={true}
                size={{ base: "base", sm: "large" }}
                fontWeight="bold"
              >
                {item.name}
              </Paragraph>
              <Paragraph
                size={{ base: "compact", sm: "base" }}
                color="secondary"
                lineClamp={2}
              >
                {item.description || "No description available."}
              </Paragraph>
            </VStack>
            <Select.Root
              value={selectedVariationId}
              onValueChange={setSelectedVariationId}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select variant" />
              </Select.Trigger>
              <Select.Content>
                {item.variations?.map((variation) => (
                  <Select.Item key={variation.id} value={variation.id}>
                    <Paragraph size="compact">{variation.name}</Paragraph>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </VStack>
        </HStack>

        <HStack justify="space-between" alignItems="flex-end">
          <Paragraph
            size={{ base: "base", sm: "large" }}
            fontWeight="semibold"
            fontFamily="mono"
          >
            {selectedVariation?.price
              ? formatMoney({
                  amount: selectedVariation.price.amount,
                  currency: selectedVariation.price.currency,
                })
              : "N/A"}
          </Paragraph>

          {selectedCartItem ? (
            <HStack gap="gap.inline.sm">
              <Button
                size="sm"
                icon={<Minus />}
                onClick={() =>
                  updateQuantity(
                    item.id,
                    selectedVariationId,
                    Math.max(0, selectedCartItem.quantity - 1)
                  )
                }
              />
              <Paragraph size="compact" fontFamily="mono">
                {selectedCartItem.quantity}
              </Paragraph>
              <Button
                size="sm"
                icon={<Plus />}
                onClick={() =>
                  updateQuantity(
                    item.id,
                    selectedVariationId,
                    selectedCartItem.quantity + 1
                  )
                }
              />
            </HStack>
          ) : (
            <Button
              size="md"
              variant="primary"
              onClick={() => {
                if (!selectedVariation) return;
                addToCart({
                  itemId: item.id,
                  variationId: selectedVariation.id,
                  itemName: item.name,
                  variationName: selectedVariation.name,
                  price: selectedVariation.price.amount,
                  quantity: 1,
                  image: image,
                  discountsApplied: [],
                  taxesApplied: [],
                });
              }}
            >
              Add to Cart
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}

export default memo(ItemCard, propsAreEqual);
