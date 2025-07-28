import { ItemBrowserContainer } from "@/containers/item-browser-container";
import { getQueryClient } from "@/shared/services/clients/query-client";
import { serverApi } from "@/shared/services/clients/server-api";
import type { SearchParams } from "@/shared/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["items", "", {}],
    queryFn: async () => {
      const searchParams: SearchParams = {
        search: "",
        filters: {},
      };

      const response = await serverApi.post("/api/items/search", searchParams);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemBrowserContainer />
    </HydrationBoundary>
  );
}
