import { useState, useEffect, useRef, useCallback } from "react";
import { calculateContainerHeight } from "../utils/layout";
import type { LayoutItem } from "../interfaces";

/**
 * Custom hook for managing container dimensions and responsiveness
 */
export const useContainerManagement = (layout: LayoutItem[]) => {
  const [containerWidth, setContainerWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate container height based on layout
  const containerHeight = useCallback(() => {
    return calculateContainerHeight(layout);
  }, [layout]);

  // Calculate container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return {
    containerWidth,
    containerHeight: containerHeight(),
    containerRef,
  };
};
