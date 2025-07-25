import Footer from '@/components/composites/common/footer'
import { HeaderContainer } from '@/containers/header-container'
import { CartStoreProvider } from '@/shared/providers'
import { serverApi } from '@/shared/services/clients/server-api'
import { css } from '@styled-system/css'
import { VStack } from '@styled-system/jsx'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/shared/services/clients/query-client'

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = getQueryClient()

  // prefetch taxes
  void queryClient.prefetchQuery({
    queryKey: ['taxes'],
    queryFn: async () => {
      const response = await serverApi.get('/api/pricing/taxes/list')
      return response.data
    },
  })

  // prefetch discounts
  void queryClient.prefetchQuery({
    queryKey: ['discounts'],
    queryFn: async () => {
      const response = await serverApi.get('/api/pricing/discounts/list')
      return response.data
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartStoreProvider>
        <VStack minH="screen">
          <HeaderContainer />
          <main className={css({ flex: '1' })}>{children}</main>
          <Footer />
        </VStack>
      </CartStoreProvider>
    </HydrationBoundary>
  )
}
