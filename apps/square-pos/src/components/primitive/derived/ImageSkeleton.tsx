import { Skeleton } from '@pallas-ui/components/src/ui/skeleton'
import { css } from '@styled-system/css'
import { Image } from 'lucide-react'

const imageSkeleton = css({
  width: 'full',
  height: 'full',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bg: 'fill'
})

export default function ImageSkeleton({ imageIconSize = 60 }: { imageIconSize: number }) {
  return (
    <Skeleton className={imageSkeleton}>
      <Image size={imageIconSize} />
    </Skeleton>
  )
}
