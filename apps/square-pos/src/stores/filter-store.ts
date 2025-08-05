import type { SearchFilters } from "@/types";
import { createStore } from "zustand/vanilla";

type FilterState = {
  filters: SearchFilters;
};

type FilterActions = {
  setFilters: (filters: SearchFilters) => void;
  handleFilterChange: (field: keyof SearchFilters, value: string) => void;
  resetFilters: () => void;
};

export type FilterStore = FilterState & FilterActions;

export const defaultFilterState: FilterState = {
  filters: {},
};

export const createFilterStore = (
  initState: FilterState = defaultFilterState
) => {
  return createStore<FilterStore>()((set, get) => ({
    ...initState,
    setFilters: (filters) => set({ filters }),
    handleFilterChange: (field: keyof SearchFilters, value: string) => {
      const filters = { ...get().filters };
      if (field === "minPrice" || field === "maxPrice") {
        filters[field] = value === "" ? undefined : Number(value);
      } else if (field === "sortBy") {
        filters.sortBy = value as "default" | "name" | "price";
        if (value === "default") {
          filters.sortOrder = undefined;
        } else if (!filters.sortOrder) {
          filters.sortOrder = "ASC";
        }
      } else if (field === "sortOrder") {
        filters.sortOrder = value as "ASC" | "DESC";
      } else if (field === "category") {
        filters.category = value;
        filters.search = undefined;
        filters.minPrice = undefined;
        filters.maxPrice = undefined;
        filters.sortBy = "default";
        filters.sortOrder = undefined;
      } else if (field === "search") {
        filters.search = value;
        filters.minPrice = undefined;
        filters.maxPrice = undefined;
        filters.sortBy = "default";
        filters.sortOrder = undefined;
      }
      set({ filters });
    },
    resetFilters: () =>
      set({
        filters: {
          category: undefined,
          minPrice: undefined,
          maxPrice: undefined,
          sortBy: "default",
          sortOrder: undefined,
        },
      }),
  }));
};
