import { Flex, HStack } from "@styled-system/jsx";
import { Heading } from "@/components/primitives/typography";
import { myCard } from "@styled-system/recipes";
import type { ItemFiltersProps } from ".";
import { memo } from "react";

type CategoryFilterProps = Pick<
  ItemFiltersProps,
  "categories" | "handleFilterChange"
> & {
  activeCategoryId: string;
};

const card = myCard({hover: false});
const activeCard = myCard({ active: true, hover: false });

function CategoryFilter({
  categories,
  activeCategoryId,
  handleFilterChange,
}: CategoryFilterProps) {
  return (
    <HStack overflowX="auto">
      {categories.map((category) => (
        <Flex
          key={category.id}
          onClick={() => handleFilterChange("category", category.id)}
          className={
            category.id === activeCategoryId ? activeCard.root : card.root
          }
          cursor="pointer"
          height={{ base: "120px", sm: "150px" }}
          width={{ base: "120px", sm: "150px" }}
          minHeight={{ base: "120px", sm: "150px" }}
          minWidth={{ base: "120px", sm: "150px" }}
          justify="flex-end"
        >
          <Heading level={5} css={{ textAlign: "right" }}>
            {category.name}
          </Heading>
        </Flex>
      ))}
    </HStack>
  );
}

export default memo(CategoryFilter);
