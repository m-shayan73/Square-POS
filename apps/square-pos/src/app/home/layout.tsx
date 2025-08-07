import Footer from '@/components/composites/common/footer'
import HeaderSkeleton from '@/components/composites/common/header/HeaderSkeleton'
import { HeaderContainer } from '@/containers/header-container'
import { CartStoreProvider } from '@/providers'
import { getQueryClient } from '@/services/clients/query-client'
import { getServerApi } from '@/services/clients/server-api'
import { css } from '@styled-system/css'
import { VStack } from '@styled-system/jsx'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'


export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = getQueryClient()
  const serverApi = await getServerApi()

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
          <Suspense fallback={<HeaderSkeleton />}>
            <HeaderContainer />
          </Suspense>
          <main className={css({ flex: '1' })}>{children}</main>
          <Footer />
        </VStack>
      </CartStoreProvider>
    </HydrationBoundary>
  )
}
