import { useQuery } from '@tanstack/react-query'

// Returns a mapping of item ids to image urls
export function useImageMapping(items: {id: string, imageUrl: string}[]) {
  const { data: images = {} } = useQuery({
    queryKey: ['order-images', items],
    queryFn: async () => {
      const imageMap: Record<string, string> = {}
      items.forEach((item) => {
        imageMap[item.id] = item.imageUrl || ''
      })
      return imageMap
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  return images
}
