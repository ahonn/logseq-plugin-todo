import { useMemo } from "react";
import { useWindowSize } from "react-use";

function useIconPosition(query: string) {
  const windowSize = useWindowSize();
  return useMemo(() => {
    let right = windowSize.width - 10;
    let bottom = 20;
    if (top?.document) {
      const iconRect = top?.document
        .querySelector(query)
        ?.getBoundingClientRect();
      if (iconRect) {
        right = iconRect.right;
        bottom = iconRect.bottom;
      }
    }
    return { right, bottom };
  }, [windowSize]);
}

export default useIconPosition;
