import { defineSlotRecipe } from '@pandacss/dev'

export const itemCard = defineSlotRecipe({
  className: 'card',
  slots: ['root', 'body', 'image'],
  base: {
    root: {
      bg: 'surface.elevated',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: 'lg',
      gap: 'gap.inline.sm',
      borderRadius: 'md',
      p: 'padding.block.3xl',
    },
    image: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 'sm',
      overflow: 'hidden',
    },
    body: {
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      gap: '2',
    },
  },
  variants: {
    variant: {
      grid: {},
      cart: {
        root: {
          bg: 'surface.layout',
          flexDirection: 'row',
          alignItems: 'center',
          p: 'padding.block.lg',
          gap: 'gap.inline.sm',
          overflow: 'visible',
        },
      },
    },
    imageSize: {
      default: {},
      xs: { image: { height: '24px', minHeight: '24px' } },
      sm: { image: { height: '48px', minHeight: '48px' } },
      md: { image: { height: '100px', minHeight: '100px' } },
      lg: { image: { height: '160px', minHeight: '160px' } },
      xl: { image: { height: '240px', minHeight: '240px' } },
      '2xl': { image: { height: '280px', minHeight: '280px' } },
    },
  },
  defaultVariants: {
    variant: 'grid',
    imageSize: 'default',
  },
})
