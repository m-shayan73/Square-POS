"use client";

import ItemList from "@/components/composites/item-list";
import { useCartStore } from "@/providers";
import { useFiltersStore } from "@/providers/FilterStoreProvider";
import { clientApi } from "@/services/clients/client-api";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function ItemListContainer() {
  const filters = useFiltersStore((state) => state.filters);
  const searchValue = filters?.search ? filters.search.trim() : "";
  const searchFilters = {
    ...filters,
    ...(searchValue.length > 1 ? { search: filters.search } : {}),
  };

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const { data: items } = useSuspenseQuery({
    queryKey: ["items", searchFilters],
    queryFn: async () => {
      const response = await clientApi.post("/api/items/search", searchFilters);

      const items = response.data;

      return items;
    },
    staleTime: 1000 * 60 * 5,
  });

  return <ItemList items={items} cartItems={cartItems} addToCart={addItem} updateQuantity={updateQuantity} />;
}
