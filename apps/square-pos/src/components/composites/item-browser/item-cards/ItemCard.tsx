"use client";

import { DecorativeBox } from "@/components/composites/common/DecorativeBox";
import ImageSkeleton from "@/components/composites/common/ImageSkeleton";
import { formatMoney } from "@/shared/utils/helpers";
import { Button } from "@pallas-ui/components/src/ui/button";
import Select from "@pallas-ui/components/src/ui/select";
import { Heading, Paragraph } from "@pallas-ui/components/src/ui/typography";
import { Box, HStack } from "@styled-system/jsx";
import { itemCard } from "@styled-system/recipes";
import NextImage from "next/image";
import React from "react";

import type { Item } from "@/shared/types/items";
import type { CartItem } from "@/shared/types/cart";

type ItemCardProps = {
  item: Item;
  addToCart: (item: CartItem) => void;
};

const card = itemCard({ imageSize: "2xl" });

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
    <Box className={card.root} aria-label={`Item card for ${item.name}`}>
      <Box className={card.image}>
        {image ? (
          <Box position="relative" width="full" height="full">
            <NextImage
              src={image?.url || ""}
              alt={image?.name || ""}
              fill={true}
              sizes=""
            />
          </Box>
        ) : (
          <DecorativeBox>
            <ImageSkeleton imageIconSize={60} />
          </DecorativeBox>
        )}
      </Box>

      <Box className={card.body}>
        <HStack justify="space-between">
          <Heading level={6} css={{ truncate: true, fontWeight: "medium" }}>
            {item.name}
          </Heading>
          <Paragraph size="compact" textStyle="italic">
            {selectedVariation?.price
              ? formatMoney({
                  amount: selectedVariation.price.amount,
                  currency: selectedVariation.price.currency,
                })
              : "N/A"}
          </Paragraph>
        </HStack>

        <Paragraph size="compact" color="secondary" truncate={true}>
          {item.description || "No description available."}
        </Paragraph>

        <HStack justify="space-between">
          <Select.Root
            value={selectedVariationId}
            onValueChange={setSelectedVariationId}
          >
            <Select.Trigger width="3/5">
              <Select.Value placeholder="Select variant" />
            </Select.Trigger>
            <Select.Content>
              {item.variations?.map((variation) => (
                <Select.Item key={variation.id} value={variation.id}>
                  {variation.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Button
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
      </Box>
    </Box>
  );
}
