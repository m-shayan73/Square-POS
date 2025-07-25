'use client'

import Avatar from '@pallas-ui/components/src/ui/avatar'
import Menubar from '@pallas-ui/components/src/ui/menu-bar'
import { Box } from '@styled-system/jsx'
import { User2 } from 'lucide-react'
import { memo } from 'react'

const menuRoot = {
  border: 'none',
}

const menuTriggerButton = {
  backgroundColor: 'transparent',
  padding: '0',
  margin: '0',
}

type AvatarMenuProps = {
  initials: string
  onSignOut: () => void
}

const AvatarMenu = memo(function AvatarMenu({ initials, onSignOut }: AvatarMenuProps) {
  return (
    <Box>
      <Menubar.Root css={menuRoot}>
        <Menubar.Menu>
          <Menubar.Trigger css={menuTriggerButton}>
            <Avatar.Root>
              <Avatar.Fallback>{initials ? initials : <User2 />}</Avatar.Fallback>
            </Avatar.Root>
          </Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item onClick={onSignOut}>Sign out</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar.Root>
    </Box>
  )
})

export default AvatarMenu
