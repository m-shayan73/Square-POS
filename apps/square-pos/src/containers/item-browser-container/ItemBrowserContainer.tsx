'use client'

import ItemBrowser from '@/components/composites/item-browser'
import { useCartStore } from '@/shared/providers'
import { useItemList } from './useItemList'

export function ItemBrowserContainer() {
  const {
    items,
    isLoading,
    search,
    setSearch,
    filters,
    filterDrawerOpen,
    handleFilterIconClick,
    handleFilterCloseDrawer,
    handleFilterChange,
    handleResetFilters,
  } = useItemList()

  const addItem = useCartStore((state) => state.addItem)

  return (
    <ItemBrowser
      items={items}
      search={search}
      setSearch={setSearch}
      filters={filters}
      filterDrawerOpen={filterDrawerOpen}
      onFilterIconClick={handleFilterIconClick}
      onFilterDrawerClose={handleFilterCloseDrawer}
      handleFilterChange={handleFilterChange}
      handleResetFilters={handleResetFilters}
      addItemToCart={addItem}
    />
  )
}
