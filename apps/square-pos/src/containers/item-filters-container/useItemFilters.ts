import { useFiltersStore } from "@/providers/FilterStoreProvider";
import { debounce } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function useItemFilters() {
  const { filters, setFilters } = useFiltersStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
    }))
  );

  const debouncedSetFilters = useMemo(() => {
    return debounce((newFilters) => {
      setFilters(newFilters);
    }, 300);
  }, [setFilters]);

  const [localFilters, setLocalFilters] = useState(filters);

  const handleFiltersChange = useCallback(
    (field: keyof typeof filters, value: string) => {
      const newFilters = { ...localFilters };

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
      } else if (field === "category") {
        newFilters.category = value;
        newFilters.search = undefined;
        newFilters.minPrice = undefined;
        newFilters.maxPrice = undefined;
        newFilters.sortBy = "default";
        newFilters.sortOrder = undefined;
      } else if (field === "search") {
        newFilters.search = value;
        newFilters.minPrice = undefined;
        newFilters.maxPrice = undefined;
        newFilters.sortBy = "default";
        newFilters.sortOrder = undefined;
      }

      setLocalFilters(newFilters);
      debouncedSetFilters(newFilters);
    },
    [localFilters, debouncedSetFilters]
  );

  return {
    localFilters,
    handleFiltersChange,
  };
}
