import { Center } from '@styled-system/jsx'
import { Spinner } from '@pallas-ui/components/src/ui/spinner'

export default function CenterSpinner() {
  return (
    <Center h="full" w="full">
      <Spinner color="primary" size="lg" />
    </Center>
  )
}