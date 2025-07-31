"use client";

import { DecorativeBox } from "@/components/composites/common/DecorativeBox";
import ImageSkeleton from "@/components/composites/common/ImageSkeleton";
import { formatMoney } from "@/shared/utils/helpers";
import { Button } from "@pallas-ui/components/src/ui/button";
import Select from "@pallas-ui/components/src/ui/select";
import { Heading, Paragraph } from "@pallas-ui/components/src/ui/typography";
import { Box, HStack, VStack } from "@styled-system/jsx";
import { itemCard } from "@styled-system/recipes";
import NextImage from "next/image";
import React from "react";

import type { CartItem } from "@/shared/types/cart";
import type { Item } from "@/shared/types/items";

type ItemCardProps = {
  item: Item;
  addToCart: (item: CartItem) => void;
};

const card = itemCard();

export default function ItemCard({ item, addToCart }: ItemCardProps) {
  // In square, each item must have a single variation. (also, price data is inside variation)
  if (!item.variations || item.variations.length === 0) {
    return null;
  }

  const [selectedVariationId, setSelectedVariationId] = React.useState(
    item.variations[0].id
  );

  // get the variation object (to display price / add item) as per the selected variation id
  const selectedVariation = item.variations?.find(
    (v) => v.id === selectedVariationId
  );

  // get the primary image for the item
  // if the selected variation has an image, use that; otherwise, use the item's
  let image = item.images?.[0] ? item.images[0] : undefined;

  if (selectedVariation?.images?.[0]) {
    image = selectedVariation.images[0];
  }

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

        <HStack justify="space-between" align="center" width="100%">
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
        </HStack>
      </VStack>
    </Box>
  );
}
