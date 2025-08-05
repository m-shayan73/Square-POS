import { Box, HStack, VStack, Grid } from "@styled-system/jsx";
import { myCard } from "@styled-system/recipes";
import { Skeleton } from "~/ui/skeleton";

const card = myCard();

function ItemCardSkeleton() {
  return (
    <Box className={card.root}>
      <VStack className={card.body}>
        <HStack align="flex-start" gap="gap.inline.md">
          <Box
            className={card.image}
            flexShrink={0}
            width={{ base: "100px", md: "130px" }}
            minHeight={{ base: "100px", md: "130px" }}
            position="relative"
          >
            <Skeleton height="full" width="full" />
          </Box>

          <VStack flex={1} justifyContent="space-between" height="full">
            <VStack gap="gap.inline.sm">
              <Skeleton width="80%" height="1em" />
              <Skeleton width="90%" height="1em" />
              <Skeleton width="60%" height="1em" />
            </VStack>
            <Skeleton width="100%" height="2em" css={{ borderRadius: "sm" }} />
          </VStack>
        </HStack>

        <HStack justify="space-between" alignItems="flex-end">
          <Skeleton width="60px" height="1.5em" />

          <Skeleton width="100px" height="2em" css={{ borderRadius: "sm" }} />
        </HStack>
      </VStack>
    </Box>
  );
}

export default function ItemListSkeleton() {
  return (
    <Grid
      columns={{ base: 1, sm: 2, xl: 3, "2xl": 4 }}
      gap={{ base: "gap.component.sm", lg: "gap.component.md" }}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <ItemCardSkeleton key={index} />
      ))}
    </Grid>
  );
}
