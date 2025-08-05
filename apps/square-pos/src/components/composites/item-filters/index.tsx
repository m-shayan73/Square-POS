import type { Category, SearchFilters } from "@/types";
import { Box, Flex, VStack } from "@styled-system/jsx";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";
import SortFilter from "./SortFilter";

export interface ItemFiltersProps {
  categories: Category[];
  filters: SearchFilters;
  handleFilterChange: (field: keyof SearchFilters, value: string) => void;
  maxPriceLimit?: number;
}

export default function ItemFilters({
  categories,
  filters,
  handleFilterChange,
}: ItemFiltersProps) {
  return (
    <VStack>
      <CategoryFilter
        categories={categories}
        activeCategoryId={filters?.category ? filters.category : "all"}
        handleFilterChange={handleFilterChange}
      />
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap="gap.inline.sm"
        align="flex-end"
      >
        <SearchBar
          search={filters?.search ? filters.search : ""}
          handleFilterChange={handleFilterChange}
        />

        <Box width={{ base: "full", sm: "fit-content" }}>
          <SortFilter
            sortBy={filters?.sortBy ? filters.sortBy : "default"}
            sortOrder={filters?.sortOrder ? filters.sortOrder : "ASC"}
            handleFilterChange={handleFilterChange}
          />
        </Box>
      </Flex>
    </VStack>
  );
}
