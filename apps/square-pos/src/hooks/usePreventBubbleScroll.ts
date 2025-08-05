import { useEffect } from "react";

export default function usePreventBubbleScroll(
  elementRef: React.RefObject<HTMLElement | null>,
  open: boolean
) {
  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight === scrollHeight;

      if (
        (atTop && e.deltaY < 0) || // trying to scroll up at the top
        (atBottom && e.deltaY > 0) // trying to scroll down at the bottom
      ) {
        e.preventDefault();
      }
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [open, elementRef]);
}
