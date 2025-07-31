import { defineSlotRecipe } from "@pandacss/dev";

export const itemCard = defineSlotRecipe({
  className: "card",
  slots: ["root", "body", "image"],
  base: {
    root: {
      bg: "surface.elevated",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
      // boxShadow: "sm",
      gap: "gap.inline.sm",
      borderRadius: "md",
      border: "thin",
      borderColor: "border",
      p: "padding.block.xl",

      _hover: {
        // boxShadow: "xl",
        transform: "translateY(-2px)",
        transition: "all 0.2s ease-in-out",
      },
    },
    image: {
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "sm",
      overflow: "hidden",
    },
    body: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      gap: "gap.inline.sm",
    },
  },
  variants: {
    variant: {
      grid: {},
      cart: {
        root: {
          bg: "surface.layout",
          flexDirection: "row",
          alignItems: "center",
          p: "padding.block.lg",
          gap: "gap.inline.sm",
          overflow: "visible",
          transform: "none",
        },
      },
    },
    // imageSize: {
    //   default: {},
    //   xs: { image: { height: "24px", minHeight: "24px" } },
    //   sm: { image: { height: "48px", minHeight: "48px" } },
    //   md: { image: { height: "100px", minHeight: "100px" } },
    //   lg: { image: { height: "180px", minHeight: "180px" } },
    //   xl: { image: { height: "200px", minHeight: "200px" } },
    // },
  },
  defaultVariants: {
    variant: "grid",
    // imageSize: "default",
  },
});
