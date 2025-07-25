import Drawer from '@/components/composites/drawer'
import { Box, Flex, HStack } from '@styled-system/jsx'
import { Filter } from 'lucide-react'
import ItemFilterDrawer from './ItemFilterDrawer'
import SearchBar from './SearchBar'
import type { SearchFilters } from '@/shared/types/items'

interface ItemFiltersProps {
  // Search
  search: string
  onSearchChange: (value: string) => void

  // Filter (Drawer)
  open: boolean
  onClose: () => void
  onFilterIconClick: () => void
  filters: SearchFilters
  handleFilterChange: (field: keyof SearchFilters, value: string) => void
  handleResetFilters: () => void
}

export default function ItemFilters({
  search,
  onSearchChange,
  open,
  onClose,
  onFilterIconClick,
  filters,
  handleFilterChange,
  handleResetFilters,
}: ItemFiltersProps) {
  return (
    <HStack justifyContent="space-between" gap="gap.inline.md">
      <Flex flex="1" justifyContent={{ base: 'flex-start', lg: 'center' }}>
        <Box flex="1" maxWidth="2xl">
          <SearchBar search={search} onSearchChange={onSearchChange} />
        </Box>
      </Flex>

      <Filter cursor="pointer" onClick={onFilterIconClick} />

      <Drawer open={open} onClose={onClose}>
        <ItemFilterDrawer
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleResetFilters={handleResetFilters}
        />
      </Drawer>
    </HStack>
  )
}
