import { formatMoney } from '@/shared/utils/helpers'
import { Paragraph } from '@pallas-ui/components/src/ui/typography'
import { VStack } from '@styled-system/jsx'
import { HStack } from '@styled-system/jsx'
import type { CartProps } from '.'
import { Skeleton } from '@pallas-ui/components/src/ui/skeleton'

interface CartTotalsProps {
  amounts: CartProps['amounts']
  isOrderCalculationLoading?: boolean
}

export default function CartTotals({ amounts, isOrderCalculationLoading }: CartTotalsProps) {
  const { subtotal, totalTax, totalDiscount, netTotal, currency } = amounts
  console.log('isOrderCalculationLoading:', isOrderCalculationLoading)


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
            {isOrderCalculationLoading ? (
              <Skeleton>...</Skeleton>
            ) : (
              <Paragraph>{total.value}</Paragraph>
            )}
          </HStack>
        ) : (
          <HStack justify="space-between" key={total.label}>
            <Paragraph>{total.label}</Paragraph>
            {isOrderCalculationLoading ? (
              <Skeleton>...</Skeleton>
            ) : (
              <Paragraph>{total.value}</Paragraph>
            )}
          </HStack>
        ),
      )}
    </VStack>
  )
}
