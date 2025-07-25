import { formatMoney } from '@/shared/utils/helpers'
import { Paragraph } from '@pallas-ui/components/src/ui/typography'
import { VStack } from '@styled-system/jsx'
import { HStack } from '@styled-system/jsx'
import type { CartProps } from '.'

interface CartTotalsProps {
  amounts: CartProps['amounts']
}

export default function CartTotals({ amounts }: CartTotalsProps) {
  const { subtotal, totalTax, totalDiscount, netTotal, currency } = amounts

  const totals = [
    {
      label: 'Subtotal',
      value: formatMoney({ amount: subtotal, currency: currency }),
    },
    { label: 'Tax', value: formatMoney({ amount: totalTax, currency: currency }) },
    { label: 'Discount', value: formatMoney({ amount: totalDiscount, currency: currency }) },
    { label: 'Total Due', value: formatMoney({ amount: netTotal, currency: currency }) },
  ]

  return (
    <VStack gap="gap.inline.xs">
      {totals.map((total) =>
        total.label === 'Total Due' ? (
          <HStack justify="space-between" fontWeight="bold" key={total.label}>
            <Paragraph>{total.label}</Paragraph>
            <Paragraph>{total.value}</Paragraph>
          </HStack>
        ) : (
          <HStack justify="space-between" key={total.label}>
            <Paragraph>{total.label}</Paragraph>
            <Paragraph>{total.value}</Paragraph>
          </HStack>
        ),
      )}
    </VStack>
  )
}
