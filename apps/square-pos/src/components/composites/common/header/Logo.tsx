import { HStack } from '@styled-system/jsx'
import Image from 'next/image'
import { Heading } from '@/components/primitives/typography'
import { css } from '@styled-system/css'
import { memo } from 'react'

const logoTitle = css({
  fontWeight: 'medium',
  display: 'none',
  sm: {
    display: 'block',
  },
})

interface LogoProps {
  handleLogoClick: () => void
}

const Logo = memo(function Logo({ handleLogoClick }: LogoProps) {
  return (
    <HStack onClick={handleLogoClick} cursor="pointer">
      <Image src="/square-logo-black.svg" alt="Square Logo" width={32} height={32} />
      <Heading level={6} className={logoTitle}>
        Square POS
      </Heading>
    </HStack>
  )
})

export default Logo
