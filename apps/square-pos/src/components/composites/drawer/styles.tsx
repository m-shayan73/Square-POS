import { css } from '@styled-system/css'

export const drawer = css({
  position: 'fixed',
  top: '0',
  right: '0',
  width: 'cartDrawer',
  height: 'full',
  p: 'padding.block.2xl',
  bg: 'surface.elevated',
  boxShadow: 'lg',
  zIndex: 9999,
  overflowY: 'auto',
})

export const drawerCloseButton = css({
  color: 'text.secondary',
  transition: 'colors',
  p: '0',

  '&:hover': {
    backgroundColor: '[inherit]',
    color: 'text',
  },
})
