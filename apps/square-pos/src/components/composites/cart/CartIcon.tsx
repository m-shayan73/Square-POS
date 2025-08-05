import { Badge } from '@/components/primitives/badge'
import { Box } from '@styled-system/jsx'
import { ShoppingCart } from 'lucide-react'
import { css } from '@styled-system/css'

type CartIconProps = {
  setOpen: (open: boolean) => void,
  itemCount: number
}

const cartIconContainer = css({
  cursor: 'pointer',
  color: 'text',
  position: 'relative',
  transition: 'transform',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
})

const cartIconBadge = css({
  position: 'absolute',
  top: '[-10px]',
  right: '[-12px]',
  fontSize: 'xs',
  borderRadius: 'full',
  '&:hover': {
    backgroundColor: 'primary.bg',
  },
})

export default function CartIcon({ setOpen, itemCount }: CartIconProps) {
  return (
    <Box className={cartIconContainer}>
      <ShoppingCart size={24} onClick={() => setOpen(true)} />

      <Badge variant="primary" size="sm" className={cartIconBadge}>
        {itemCount}
      </Badge>
    </Box>
  )
}
