import { Label } from "@/components/primitives/label";
import Select from "@/components/primitives/select";
import type { SearchFilters } from "@/types/items";
import { Box, HStack, VStack } from "@styled-system/jsx";
import { memo } from "react";
import type { ItemFiltersProps } from ".";

type SortFilterProps = Pick<ItemFiltersProps, "handleFilterChange"> & {
  sortBy: SearchFilters["sortBy"];
  sortOrder: SearchFilters["sortOrder"];
};

function SortFilter({
  sortBy,
  sortOrder,
  handleFilterChange,
}: SortFilterProps) {
  return (
    <VStack gap="gap.inline.xs">
      <Label htmlFor="sortBy">Sort By</Label>

      <HStack gap="gap.inline.sm">
        <Box width={{ base: "2/3", sm: "100px" }}>
          <Select.Root
            value={sortBy}
            onValueChange={(v: string) => handleFilterChange("sortBy", v)}
          >
            <Select.Trigger id="sortBy">
              <Select.Value placeholder="Sort by" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="default">Default</Select.Item>
              <Select.Item value="name">Name</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>

        <Box width={{ base: "1/3", sm: "100px" }}>
          <Select.Root
            value={sortOrder ?? "ASC"}
            onValueChange={(v: string) => handleFilterChange("sortOrder", v)}
            disabled={sortBy === "default"}
          >
            <Select.Trigger id="sortOrder">
              <Select.Value placeholder="Order" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="ASC">ASC</Select.Item>
              <Select.Item value="DESC">DESC</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>
      </HStack>
    </VStack>
  );
}

export default memo(SortFilter);
