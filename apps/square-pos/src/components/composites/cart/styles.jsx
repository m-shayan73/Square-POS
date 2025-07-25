import { css } from '@styled-system/css'

export const cartIconContainer = css({
  cursor: 'pointer',
  color: 'text',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
})

export const cartIconBadge = css({
  position: 'absolute',
  top: '-10px',
  right: '-12px',
  fontSize: 'xs',
  borderRadius: 'full',
  '&:hover': {
    backgroundColor: 'primary.bg',
  },
})