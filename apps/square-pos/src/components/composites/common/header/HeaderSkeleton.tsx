import { Box, HStack } from '@styled-system/jsx'
import Logo from './Logo'
import { headerStyles } from './styles'
import { Skeleton } from '~/ui/skeleton'

function HeaderSkeleton() {
  return (
    <HStack className={headerStyles}>
      <Box>
        <Logo handleLogoClick={() => {}} />
      </Box>

      <HStack gap="gap.inline.sm">
        <Skeleton width="32px" height="32px" borderRadius="sm" />
      </HStack>
    </HStack>
  )
}

export default HeaderSkeleton