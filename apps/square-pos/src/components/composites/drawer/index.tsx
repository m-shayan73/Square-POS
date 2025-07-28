import { Button } from '@pallas-ui/components/src/ui/button'
import { Flex, VStack } from '@styled-system/jsx'
import { X } from 'lucide-react'
import { memo, useEffect, useRef } from 'react'
import { drawerCloseButton, drawerContainer } from './styles'

const Drawer = memo(function Drawer({
  open,
  onClose,
  children,
}: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) return

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = drawer
      const atTop = scrollTop === 0
      const atBottom = scrollTop + clientHeight === scrollHeight

      if (
        (atTop && e.deltaY < 0) || // trying to scroll up at the top
        (atBottom && e.deltaY > 0) // trying to scroll down at the bottom
      ) {
        e.preventDefault()
      }
    }

    drawer.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      drawer.removeEventListener('wheel', handleWheel)
    }
  }, [open, drawerRef])

  if (!open) return null
  return (
    <VStack ref={drawerRef} gap="gap.inline.sm" className={drawerContainer}>
      <Flex justify="flex-end">
        <Button onClick={onClose} variant="text" className={drawerCloseButton}>
          <X size={24} />
        </Button>
      </Flex>

      {children}
    </VStack>
  )
})

export default Drawer
