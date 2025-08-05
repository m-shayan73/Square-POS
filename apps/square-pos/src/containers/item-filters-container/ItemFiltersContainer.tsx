"use client";

import ItemFilters from "@/components/composites/item-filters";
import { clientApi } from "@/services/clients/client-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import useItemFilters from "./useItemFilters";

export default function ItemFiltersContainer() {
  const { localFilters, handleFiltersChange } = useItemFilters();

  const { data: categories } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await clientApi.get("/api/items/categories");
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
  });

  return (
    <ItemFilters
      filters={localFilters}
      categories={categories || []}
      handleFilterChange={handleFiltersChange}
    />
  );
}
