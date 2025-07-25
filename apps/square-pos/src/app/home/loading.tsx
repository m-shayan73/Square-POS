import { Box } from '@styled-system/jsx'
import { Spinner } from '@pallas-ui/components/src/ui/spinner'

export default function Loading() {
  return (
    <Box position="fixed" inset="0" display="flex" alignItems="center" justifyContent="center">
      <Spinner color="primary" size="lg" />
    </Box>
  )
}
