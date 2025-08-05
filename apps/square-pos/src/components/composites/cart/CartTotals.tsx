import { Skeleton } from "@/components/primitives/skeleton";
import { Paragraph } from "@/components/primitives/typography";
import { formatMoney } from "@/utils/helpers";
import { VStack } from "@styled-system/jsx";
import { HStack } from "@styled-system/jsx";
import type { CartProps } from ".";

interface CartTotalsProps {
  amounts: CartProps["amounts"];
  isOrderCalculationLoading?: boolean;
}

export default function CartTotals({
  amounts,
  isOrderCalculationLoading,
}: CartTotalsProps) {
  const { subtotal, totalTax, totalDiscount, netTotal, currency } = amounts;

  const totals = [
    {
      label: "Subtotal",
      value: formatMoney({ amount: subtotal, currency: currency }),
    },
    {
      label: "Tax",
      value: formatMoney({ amount: totalTax, currency: currency }),
    },
    {
      label: "Discount",
      value: formatMoney({ amount: totalDiscount, currency: currency }),
    },
    {
      label: "Total Due",
      value: formatMoney({ amount: netTotal, currency: currency }),
    },
  ];

  return (
    <VStack gap="gap.inline.xs">
      {totals.map((total) =>
        total.label === "Total Due" ? (
          <HStack justify="space-between" fontWeight="bold" key={total.label}>
            <Paragraph>{total.label}</Paragraph>
            {isOrderCalculationLoading ? (
              <Skeleton bgColor="surface.elevated">...</Skeleton>
            ) : (
              <Paragraph>{total.value}</Paragraph>
            )}
          </HStack>
        ) : (
          <HStack justify="space-between" key={total.label}>
            <Paragraph>{total.label}</Paragraph>
            {isOrderCalculationLoading ? (
              <Skeleton bgColor="surface.elevated">...</Skeleton>
            ) : (
              <Paragraph>{total.value}</Paragraph>
            )}
          </HStack>
        )
      )}
    </VStack>
  );
}
