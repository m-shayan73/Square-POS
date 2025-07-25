import { defineSlotRecipe } from '@pandacss/dev'

export const command = defineSlotRecipe({
  className: 'command',
  description: 'Styles for the Command component',
  slots: [
    'root',
    'dialog',
    'input',
    'list',
    'empty',
    'group',
    'item',
    'itemIndicator',
    'separator',
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      bg: '{colors.surface.elevated}',
      rounded: '{radii.lg}',
      border: 'solid',
      borderWidth: '1px',
      borderColor: '{colors.border}',
      shadow: 'md',
      animationStyle: 'slideFadeIn',
      animationDuration: '{durations.normal}',
      "& [data-slot='command-input-wrapper']": {
        px: '{spacing.padding.inline.sm}',
        py: '{spacing.padding.inline.xs}',
        gap: '{spacing.gap.inline.xs}',
        borderBottom: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: '{colors.fill}',
        alignItems: 'center',
      },
    },
    input: {
      w: 'full',
      outline: 'none',
      bg: 'transparent',
      rounded: '{radii.md}',
      p: '{spacing.padding.block.xs}',
      _disabled: {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
      color: '{colors.text}',
      textStyle: 'sm',
    },
    list: {
      '& [data-selected=true]': {
        bg: '{colors.primary.bg}',
      },
      '& [data-disabled=true]': {
        pointerEvents: 'none',
        opacity: 0.5,
      },
      overflowX: 'hidden',
      overflowY: 'auto',
      color: '{colors.text}',
      outline: 'none',
      h: 'full',
    },
    empty: {
      py: 4,
      px: 2,
      textStyle: 'sm',
    },
    group: {
      '& [cmdk-group-heading]': {
        color: '{colors.text.tertiary}',
        textStyle: 'sm',
        px: 1,
        py: 0.5,
        fontWeight: 'medium',
      },
      p: '{spacing.padding.block.sm}',
    },
    item: {
      position: 'relative',
      display: 'flex',
      cursor: 'default',
      alignItems: 'center',
      gap: 2,
      rounded: '{radii.md}',
      py: '{spacing.padding.block.md}',
      pl: '{spacing.gap.component.lg}',
      pr: '{spacing.padding.inline.sm}',
      textStyle: 'sm',
      outline: 'hidden',
      userSelect: 'none',
    },
    separator: {
      h: '1px',
      bg: '{colors.fill}',
      my: '{spacing.1}',
    },
    itemIndicator: {
      position: 'absolute',
      left: '{spacing.padding.inline.xs}',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  variants: {
    type: {
      flat: {
        root: {
          h: 'full',
          w: 'full',
        },
        itemIndicator: {
          h: '{sizes.icon.sm}',
          w: '{sizes.icon.sm}',
        },
      },
      floating: {
        root: {
          "& [data-slot='command-input-icon']": {
            ml: '{spacing.padding.inline.xs}',
            size: '{sizes.icon.xl} !important',
          },
          '& [cmdk-input]': {
            height: '{sizes.12}',
          },
          "& [data-slot='command-input-wrapper']": {
            height: '{sizes.12}',
          },
          "& [data-slot='command-dialog-close']:is(:hover, [data-hover])": {
            borderColor: '{colors.primary.hover}',
            opacity: 1,
            cursor: 'pointer',
          },
          "& [data-slot='command-dialog-close']": {
            base: {
              top: '{spacing.padding.inline.md}',
              right: '{spacing.padding.block.lg}',
              color: '{colors.text}',
              position: 'absolute',
              rounded: '{radii.xs}',
              flexShrink: 0,
              opacity: 0.5,
              border: '1px solid transparent',
              p: 0,
            },
            _focus: {
              borderColor: '{colors.primary.hover}',
              outline: '1px solid {colors.primary.bgHover}',
            },
            _disabled: {
              pointerEvents: 'none',
            },
            _open: {
              bg: '{colors.bgSolid}',
            },
          },
        },
        input: {
          textStyle: 'md',
        },
        empty: {
          p: '{spacing.padding.inline.sm}',
          textStyle: 'md',
        },
        group: {
          '& [cmdk-group-heading]': {
            color: '{colors.text.tertiary}',
            fontWeight: 'medium',
            p: '{spacing.padding.inline.sm}',
          },
        },
        list: {
          '& [cmdk-group]:not([hidden]) ~ [cmdk-group]': {
            pt: 0,
          },
        },
        item: {
          py: '{spacing.padding.inline.md}',
          pl: '{spacing.layout.section.lg}',
          pr: '{spacing.padding.block.md}',
          textStyle: 'md',
        },
        itemIndicator: {
          left: '{spacing.padding.inline.sm}',
        },
      },
    },
  },
  defaultVariants: {
    type: 'flat',
  },
  staticCss: [{ type: ['*'] }],
})
