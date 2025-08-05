"use client";

import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import { type FilterStore, createFilterStore } from "@/stores/filter-store";

export type FiltersStoreApi = ReturnType<typeof createFilterStore>;

const FiltersStoreContext = createContext<FiltersStoreApi | undefined>(
  undefined
);

interface FiltersStoreContextProps {
  children: React.ReactNode;
}

export const FiltersStoreProvider = ({
  children,
}: FiltersStoreContextProps) => {
  const filtersStore = useRef<FiltersStoreApi | undefined>(undefined);

  if (filtersStore.current === undefined) {
    filtersStore.current = createFilterStore();
  }

  return (
    <FiltersStoreContext.Provider value={filtersStore.current}>
      {children}
    </FiltersStoreContext.Provider>
  );
};

export const useFiltersStore = <T,>(selector: (store: FilterStore) => T): T => {
  const filtersStoreContext = useContext(FiltersStoreContext);

  if (!filtersStoreContext) {
    throw new Error("useFiltersStore must be used within FiltersStoreProvider");
  }

  return useStore(filtersStoreContext, selector);
};
