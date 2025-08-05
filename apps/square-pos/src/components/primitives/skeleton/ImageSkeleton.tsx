import { Skeleton } from "@/components/primitives/skeleton";
import { Image as ImageIcon } from "lucide-react";

export function ImageSkeleton({
  imageIconSize = 60,
}: {
  imageIconSize: number;
}) {
  return (
    <Skeleton
      css={{
        width: "full",
        height: "full",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bg: "fill",
      }}
    >
      <ImageIcon size={imageIconSize} />
    </Skeleton>
  );
}
