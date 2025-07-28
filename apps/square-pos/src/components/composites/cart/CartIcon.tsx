import { Badge } from '@pallas-ui/components/src/ui/badge'
import { Box } from '@styled-system/jsx'
import { ShoppingCart } from 'lucide-react'
import { cartIconBadge, cartIconContainer } from './styles'
import { memo } from 'react'

type CartIconProps = {
  setOpen: (open: boolean) => void
  itemCount: number
}

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
