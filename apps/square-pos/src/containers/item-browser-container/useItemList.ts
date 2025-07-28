import { clientApi } from "@/shared/services/clients/client-api";
import type { SearchFilters, SearchParams } from "@/shared/types";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useMemo, useState, useCallback } from "react";

export function useItemList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { filters, debouncedFilters, ...filterHelpers } = useFilters();

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 300),
    []
  );

  const handleSetSearch = useCallback(
    (value: string) => {
      setSearch(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );

  const { items, isPending } = useItemsSearch(
    debouncedSearch,
    debouncedFilters
  );

  return {
    search,
    setSearch: handleSetSearch,
    filters,
    ...filterHelpers,
    items,
    isLoading: isPending,
  };
}

function useFilters() {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>({});

  const debouncedSetFilters = useMemo(
    () =>
      debounce((newFilters: SearchFilters) => {
        setDebouncedFilters(newFilters);
      }, 500),
    []
  );

  const handleFilterIconClick = useCallback(() => {
    setFilterDrawerOpen(true);
  }, []);

  const handleFilterCloseDrawer = useCallback(() => {
    setFilterDrawerOpen(false);
  }, []);

  const handleFilterChange = useCallback(
    (field: keyof SearchFilters, value: string) => {
      const newFilters = { ...filters };

      if (field === "minPrice" || field === "maxPrice") {
        newFilters[field] = value === "" ? undefined : Number(value);
      } else if (field === "sortBy") {
        newFilters.sortBy = value as "default" | "name" | "price";
        if (value === "default") {
          newFilters.sortOrder = undefined;
        } else if (!newFilters.sortOrder) {
          newFilters.sortOrder = "ASC";
        }
      } else if (field === "sortOrder") {
        newFilters.sortOrder = value as "ASC" | "DESC";
      }

      setFilters(newFilters);
      debouncedSetFilters(newFilters);
    },
    [filters, debouncedSetFilters]
  );

  const handleResetFilters = useCallback(() => {
    const resetFilters = {
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "default" as const,
      sortOrder: undefined,
    };
    setFilters(resetFilters);
  }, []);

  return {
    filterDrawerOpen,
    filters,
    debouncedFilters,
    handleFilterIconClick,
    handleFilterCloseDrawer,
    handleFilterChange,
    handleResetFilters,
  };
}

function useItemsSearch(search: string, filters: SearchFilters) {
  const trimmedSearch = useMemo(
    () => (search.trim().length > 1 ? search.trim() : ""),
    [search]
  );

  const { data, isPending } = useQuery({
    queryKey: ["items", trimmedSearch, filters],
    queryFn: async () => {
      const searchParams: SearchParams = {
        search: trimmedSearch,
        filters: filters,
      };

      const response = await clientApi.post("api/items/search", searchParams);

      const items = response.data;

      return items;
    },
    staleTime: 1000 * 60 * 5,
  });

  return { items: data, isPending };
}
