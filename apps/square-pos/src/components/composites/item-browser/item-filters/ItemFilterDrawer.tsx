import { Button } from '@pallas-ui/components/src/ui/button'
import { Input } from '@pallas-ui/components/src/ui/input'
import { Label } from '@pallas-ui/components/src/ui/label'
import Select from '@pallas-ui/components/src/ui/select'
import { Heading } from '@pallas-ui/components/src/ui/typography'
import { Box, HStack, VStack } from '@styled-system/jsx'
import type { SearchFilters } from '@/shared/types/items'

interface ItemFiltersDrawerProps {
  filters: SearchFilters
  handleFilterChange: (field: keyof SearchFilters, value: string) => void
  handleResetFilters: () => void
}

export default function ItemFiltersDrawer({
  filters,
  handleFilterChange,
  handleResetFilters,
}: ItemFiltersDrawerProps) {
  return (
    <VStack justifyContent="space-between" height="full" width="full">
      <VStack gap="gap.component.md">
        <Heading level={5}>Filters</Heading>

        <VStack gap="gap.inline.xs">
          <Label>Price Range</Label>

          <HStack gap="gap.inline.sm">
            <Input>
              <Input.Text
                id="minPrice"
                type="number"
                value={filters.minPrice !== undefined ? filters.minPrice.toString() : ''}
                placeholder="0"
                min={0}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </Input>
            -
            <Input>
              <Input.Text
                id="maxPrice"
                type="number"
                value={filters.maxPrice !== undefined ? filters.maxPrice.toString() : ''}
                placeholder="∞"
                min={0}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </Input>
          </HStack>
        </VStack>

        <VStack gap="gap.inline.xs">
          <Label htmlFor="sortBy">Sort By</Label>

          <HStack gap="gap.inline.sm">
            <Box width="2/3">
              <Select.Root
                value={filters.sortBy}
                onValueChange={(v: string) => handleFilterChange('sortBy', v)}
              >
                <Select.Trigger id="sortBy">
                  <Select.Value placeholder="Default" />
                </Select.Trigger>
                <Select.Content style={{ zIndex: 9999 }}>
                  <Select.Item value="default">Default</Select.Item>
                  <Select.Item value="name">Name</Select.Item>
                  {/* <Select.Item value="price">Price</Select.Item> */}
                  {/* <Select.Item value="created_at">Created At</Select.Item> */}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box width="1/3">
              <Select.Root
                value={filters.sortOrder ?? 'ASC'}
                onValueChange={(v: string) => handleFilterChange('sortOrder', v)}
                disabled={!filters.sortBy || filters.sortBy === 'default'}
              >
                <Select.Trigger id="sortOrder">
                  <Select.Value placeholder="Order" />
                </Select.Trigger>
                <Select.Content style={{ zIndex: 9999 }}>
                  <Select.Item value="ASC">ASC</Select.Item>
                  <Select.Item value="DESC">DESC</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </HStack>
        </VStack>
      </VStack>

      <HStack gap="gap.inline.sm" justifyContent="space-between">
        <Button onClick={handleResetFilters} variant="outlined" size="lg">
          Reset
        </Button>
      </HStack>
    </VStack>
  )
}
