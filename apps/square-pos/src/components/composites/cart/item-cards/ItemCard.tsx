import type { ItemCardsProps } from "@/components/composites/cart/item-cards";
import ImageSkeleton from "@/components/composites/common/ImageSkeleton";
import type { DiscountOption, TaxOption } from "@/shared/types/ui";
import { Button } from "@pallas-ui/components/src/ui/button";
import { Paragraph } from "@pallas-ui/components/src/ui/typography";
import { Box, Grid, HStack, VStack } from "@styled-system/jsx";
import { itemCard } from "@styled-system/recipes";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useMemo } from "react";
import type { OnChangeValue } from "react-select";
import Select from "react-select";
import lodash from "lodash";

type ItemCardProps = { item: ItemCardsProps["items"][number] } & Pick<
  ItemCardsProps,
  | "updateQuantity"
  | "availableDiscounts"
  | "availableTaxes"
  | "handleItemDiscountsChange"
  | "handleItemTaxesChange"
>;

function propsAreEqual(prev: ItemCardProps, next: ItemCardProps) {
  return (
    prev.item.itemId === next.item.itemId &&
    prev.item.variationId === next.item.variationId &&
    prev.item.quantity === next.item.quantity &&
    lodash.isEqual(prev.item.discountsApplied, next.item.discountsApplied) &&
    lodash.isEqual(prev.item.taxesApplied, next.item.taxesApplied)
  );
}

const card = itemCard({ variant: "cart" });

const CartItemCard = memo(function CartItemCard({
  item,
  updateQuantity,
  availableDiscounts,
  availableTaxes,
  handleItemDiscountsChange,
  handleItemTaxesChange,
}: ItemCardProps) {
  const formattedPrice = item.price.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });

  const handleDiscountChange = useCallback(
    (newValue: OnChangeValue<DiscountOption, true>) => {
      handleItemDiscountsChange(item.itemId, item.variationId, newValue);
    },
    [handleItemDiscountsChange, item.itemId, item.variationId]
  );

  const handleTaxChange = useCallback(
    (newValue: OnChangeValue<TaxOption, true>) => {
      handleItemTaxesChange(item.itemId, item.variationId, newValue);
    },
    [handleItemTaxesChange, item.itemId, item.variationId]
  );

  const handleDecrement = () =>
    updateQuantity(item.itemId, item.variationId, item.quantity - 1);
  const handleIncrement = () =>
    updateQuantity(item.itemId, item.variationId, item.quantity + 1);

  const imageComponent = useMemo(() => {
    return item.image ? (
      <Image src={item.image.url} alt={item.image.name} fill={true} />
    ) : (
      <ImageSkeleton imageIconSize={32} />
    );
  }, [item.image]);

  return (
    <VStack className={card.root}>
      <HStack width="full">
        <Box className={card.image} width={"1/5"} height={{base: "40px", md: "56px"}}>
          {imageComponent}
        </Box>

        <Box flex="1">
          <Paragraph size={{ base: "base", "2xl": "compact" }} textStyle="bold">
            {item.itemName}
          </Paragraph>
          <Paragraph size={{ base: "compact", "2xl": "subscript" }} color="secondary">
            {item.variationName}
          </Paragraph>
          <Paragraph size={{ base: "compact", "2xl": "subscript" }} textStyle="italic">
            Price: {formattedPrice}
          </Paragraph>
        </Box>

        <HStack>
          <Button size="sm" icon={<Minus />} onClick={handleDecrement} />
          <Box fontSize="sm">{item.quantity}</Box>
          <Button size="sm" icon={<Plus />} onClick={handleIncrement} />
        </HStack>
      </HStack>

      <Grid
        gridTemplateColumns="auto 1fr"
        gap="gap.inline.xs"
        textStyle={{ base: "xs", md: "sm" }}
        width="full"
        alignItems="flex-end"
      >
        <Paragraph size={{ base: "compact", "2xl": "subscript" }}>
          Discounts:
        </Paragraph>
        <Select
          isMulti={true}
          options={availableDiscounts}
          placeholder="Apply discount"
          isClearable={true}
          value={item.discountsApplied}
          onChange={handleDiscountChange}
        />

        <Paragraph size={{ base: "compact", "2xl": "subscript" }}>
          Taxes:
        </Paragraph>
        <Select
          isMulti={true}
          options={availableTaxes}
          placeholder="Apply tax"
          isClearable={true}
          value={item.taxesApplied}
          onChange={handleTaxChange}
        />
      </Grid>
    </VStack>
  );
}, propsAreEqual);

export default CartItemCard;
