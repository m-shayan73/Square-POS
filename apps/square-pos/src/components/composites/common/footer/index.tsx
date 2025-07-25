import { css } from '@styled-system/css'
import { memo } from 'react'
import { CURRENT_YEAR } from '@/shared/utils/constants'

const footer = css({
  bg: 'bgSolid',
  py: 'padding.block.2xl',
  textAlign: 'center',
  color: 'bgSolid.text',
})

const Footer = memo(function Footer() {
  return <footer className={footer}>© {CURRENT_YEAR} Square POS. All rights reserved.</footer>
})

export default Footer
