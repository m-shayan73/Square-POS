// Helper to format cents to currency
export function formatMoney(money: { amount: number; currency?: string }) {
  const { amount, currency = 'USD' } = money
  return (amount).toLocaleString(undefined, {
    style: 'currency',
    currency,
  })
}
