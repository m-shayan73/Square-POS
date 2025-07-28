"use client";

import { memo } from "react";
import ItemCards from "@/components/composites/item-browser/item-cards";
import ItemFilters from "@/components/composites/item-browser/item-filters";
import { css } from "@styled-system/css";
import { VStack } from "@styled-system/jsx";
import CenterSpinner from "@/components/composites/common/CenterSpinner";

import type { Item, CartItem, SearchFilters } from "@/shared/types";

export interface ItemBrowserProps {
  items: Item[];
  isItemListLoading: boolean;
  search: string;
  setSearch: (search: string) => void;
  filterDrawerOpen: boolean;
  onFilterDrawerClose: () => void;
  onFilterIconClick: () => void;
  filters: SearchFilters;
  handleFilterChange: (field: keyof SearchFilters, value: string) => void;
  handleResetFilters: () => void;
  addItemToCart: (item: CartItem) => void;
}

function ItemBrowser({
  items,
  isItemListLoading,
  search,
  setSearch,
  filterDrawerOpen,
  onFilterDrawerClose,
  onFilterIconClick,
  filters,
  handleFilterChange,
  handleResetFilters,
  addItemToCart,
}: ItemBrowserProps) {
  return (
    <VStack
      className={css({
        marginTop: "padding.block.sm",
        padding: "padding.block.3xl",
        gap: "gap.component.lg",
        overflowY: "auto",
      })}
    >
      <ItemFilters
        search={search}
        onSearchChange={setSearch}
        open={filterDrawerOpen}
        onClose={onFilterDrawerClose}
        onFilterIconClick={onFilterIconClick}
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleResetFilters={handleResetFilters}
      />

      {isItemListLoading ? (
        <CenterSpinner />
      ) : (
        <ItemCards items={items} addToCart={addItemToCart} />
      )}
    </VStack>
  );
}

export default memo(ItemBrowser);
