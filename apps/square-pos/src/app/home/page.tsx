import ItemListSkeleton from "@/components/composites/item-list/ItemListSkeleton";
import { CenterSpinner } from "@/components/primitives/spinner";
import ItemFiltersContainer from "@/containers/item-filters-container/ItemFiltersContainer";
import ItemListContainer from "@/containers/item-list-container/ItemListContainer";
import { FiltersStoreProvider } from "@/providers/FilterStoreProvider";
import { getQueryClient } from "@/services/clients/query-client";
import { getServerApi } from "@/services/clients/server-api";
import { VStack } from "@styled-system/jsx";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Home() {
  const queryClient = getQueryClient();
  const serverApi = await getServerApi();

  // Prefetch items
  await queryClient.prefetchQuery({
    queryKey: ["items", {}],
    queryFn: async () => {
      const response = await serverApi.post("/api/items/search", {});
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Prefetch categories
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await serverApi.get("/api/items/categories");
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VStack
        padding="padding.block.3xl"
        gap="gap.component.lg"
        overflowY="auto"
      >
        <FiltersStoreProvider>
          <Suspense fallback={<CenterSpinner />}>
            <ItemFiltersContainer />

            <Suspense fallback={<ItemListSkeleton />}>
              <ItemListContainer />
            </Suspense>
          </Suspense>
        </FiltersStoreProvider>
      </VStack>
    </HydrationBoundary>
  );
}
