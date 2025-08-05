import { defineSlotRecipe } from "@pandacss/dev";

export const myCard = defineSlotRecipe({
  className: "card",
  slots: ["root", "body", "image"],
  base: {
    root: {
      bg: "surface.elevated",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
      gap: "gap.inline.sm",
      borderRadius: "md",
      border: "thin",
      borderColor: "border",
      p: "padding.block.xl",
      transition: "all 0.2s ease-in-out",
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
    active: {
      true: {
        root: {
          border: "medium",
          borderColor: "success.border",
        },
      },
      false: {},
    },
    hover: {
      true: {
        root: {
          _hover: {
            transform: "translateY(-2px)",
          },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    variant: "grid",
    active: false,
    hover: true,
  },
});
