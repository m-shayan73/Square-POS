import { createPreset } from '@pallas-ui/panda-preset'
import { presetPrimaryColors } from '@pallas-ui/panda-preset/colors/paletteGenerator'
import type { ThemeColorPalette } from '@pallas-ui/panda-preset/types'
import { defineConfig } from '@pandacss/dev'
import { myCard } from '@/styles/recipes/card'

const themeColorPalette: ThemeColorPalette = {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  primary: { colorName: 'blue', colorValue: presetPrimaryColors['blue']! },
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  error: { colorName: 'red', colorValue: presetPrimaryColors['red']! },
  success: {
    colorName: 'green',
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    colorValue: presetPrimaryColors['green']!,
  },
  warning: {
    colorName: 'yellow',
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    colorValue: presetPrimaryColors['yellow']!,
  },
  info: {
    colorName: 'blue',
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    colorValue: presetPrimaryColors['blue']!,
  },
}

export default defineConfig({
  // strictTokens: true,
  // Whether to use css reset
  preflight: true,

  presets: [
    createPreset({
      colors: themeColorPalette,
      baseRadius: 2,
    }),
  ],

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        fonts: {
          heading: {
            value: 'var(--font-heading)',
          },
          body: {
            value: 'var(--font-sans)',
          },
          mono: {
            value: 'var(--font-mono)',
          },
        },
        borders: {
          thin: { value: '1px solid' },
          medium: { value: '2px solid' },
          thick: { value: '4px solid' },
        },
      },
      semanticTokens: {
        sizes: {
          header: { value: '4rem' },
          cartDrawer: { value: { base: '340px', sm: '380px' } },
        },
        spacing: {
          padding: {
            block: {
              xl: { value: '1rem' },
              '2xl': { value: '1.25rem' },
              '3xl': { value: '1.5rem' },
            },
          },
        },
      },
      recipes: {
        myCard: myCard,
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
  jsxFramework: 'react',
})
