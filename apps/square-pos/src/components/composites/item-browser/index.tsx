'use client'

import ItemCards from '@/components/composites/item-browser/item-cards'
import ItemFilters from '@/components/composites/item-browser/item-filters'
import { css } from '@styled-system/css'
import { VStack } from '@styled-system/jsx'
import { Suspense } from 'react'

import type { Item } from '@/shared/types/items'
import type { CartItem } from '@/shared/types/cart'
import type { SearchFilters } from '@/shared/types/items'
import CenterSpinner from '@/components/primitive/derived/CenterSpinner'

export interface ItemListProps {
  // Items
  items: Item[]
  // images?: Record<string, string>

  // Search
  search: string
  setSearch: (search: string) => void

  // Filter
  filterDrawerOpen: boolean
  onFilterDrawerClose: () => void
  onFilterIconClick: () => void
  filters: SearchFilters
  handleFilterChange: (field: keyof SearchFilters, value: string) => void
  handleResetFilters: () => void

  // Actions
  addItemToCart: (item: CartItem) => void
}

export default function ItemBrowser({
  items,
  search,
  setSearch,
  filterDrawerOpen,
  onFilterDrawerClose,
  onFilterIconClick,
  filters,
  handleFilterChange,
  handleResetFilters,
  addItemToCart,
}: ItemListProps) {
  return (
    <VStack
      className={css({
        marginTop: 'padding.block.sm',
        padding: 'padding.block.3xl',
        gap: 'gap.component.lg',
        overflowY: 'auto',
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
      <Suspense fallback={<p>loadingg...</p>}>
        <ItemCards items={items} addToCart={addItemToCart} />
      </Suspense>
    </VStack>
  )
}
