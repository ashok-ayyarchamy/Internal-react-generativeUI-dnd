import type { LayoutItem, DraggableComponent } from "../interfaces";

/**
 * Calculate optimal position for a new component
 */
export const calculateOptimalPosition = (
  component: DraggableComponent,
  layout: LayoutItem[]
): { x: number; y: number } => {
  // Calculate the maximum needed rows based on existing components and the new component
  const maxExistingRow =
    layout.length > 0 ? Math.max(...layout.map((item) => item.y + item.h)) : 0;
  const maxNeededRows = Math.max(maxExistingRow + 2, 50); // Default height of 2, allow up to 50 rows

  for (let y = 0; y < maxNeededRows; y++) {
    for (let x = 0; x <= 12 - 2; x++) {
      // Default width of 2
      const newItem = { x, y, w: 2, h: 2 }; // Default width and height of 2
      if (
        !layout.some(
          (existing) =>
            newItem.x < existing.x + existing.w &&
            newItem.x + newItem.w > existing.x &&
            newItem.y < existing.y + existing.h &&
            newItem.y + newItem.h > existing.y
        )
      ) {
        return { x, y };
      }
    }
  }
  return {
    x: 0,
    y: layout.length ? Math.max(...layout.map((item) => item.y + item.h)) : 0,
  };
};

/**
 * Calculate optimal size for a component
 */
export const calculateOptimalSize = (
  component: DraggableComponent
): {
  w: number;
  h: number;
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
} => {
  return {
    w: 2, // Default width
    h: 2, // Default height
    minW: 1,
    maxW: 12,
    minH: 1,
    maxH: 50, // Allow up to 50 rows for taller components
  };
};

/**
 * Calculate dynamic container height based on layout
 */
export const calculateContainerHeight = (layout: LayoutItem[]): number => {
  if (layout.length === 0) return 600; // Default height

  const maxRow = Math.max(...layout.map((item) => item.y + item.h));
  const rowHeight = 40;
  const margin = 8;
  const containerPadding = 8;
  const minHeight = 600;

  const calculatedHeight =
    maxRow * rowHeight + (maxRow - 1) * margin + containerPadding * 2;
  return Math.max(calculatedHeight, minHeight);
};

/**
 * Calculate chat position based on component position
 */
export const calculateChatPosition = (
  componentId: string | null,
  layout: LayoutItem[],
  containerWidth: number,
  containerRect: DOMRect | null
): { top: string; left: string } => {
  if (!componentId) return { top: "50px", left: "50px" };

  const componentLayout = layout.find((item) => item.i === componentId);
  if (!componentLayout) return { top: "50px", left: "50px" };

  // Calculate position based on grid layout
  const rowHeight = 40;
  const margin = 8;
  const containerPadding = 8;
  const appBarHeight = 32; // Height of the component's app bar

  const componentTop =
    componentLayout.y * rowHeight +
    componentLayout.y * margin +
    containerPadding;
  const componentLeft =
    (componentLayout.x / 12) * containerWidth +
    componentLayout.x * margin +
    containerPadding;

  // Get the container's position in the viewport
  if (!containerRect) return { top: "50px", left: "50px" };

  // Calculate absolute position in viewport
  const absoluteTop = containerRect.top + componentTop + appBarHeight; // Add app bar height
  const absoluteLeft = containerRect.left + componentLeft;

  // Position chat at the top-right corner of the component, below the app bar
  return {
    top: `${absoluteTop}px`,
    left: `${absoluteLeft + (componentLayout.w / 12) * containerWidth - 300}px`, // Align to right edge of component
  };
};

/**
 * Create a new layout item for a component
 */
export const createLayoutItem = (
  component: DraggableComponent,
  layout: LayoutItem[]
): LayoutItem => {
  const position = calculateOptimalPosition(component, layout);
  const size = calculateOptimalSize(component);

  return {
    i: component.id,
    x: position.x,
    y: position.y,
    w: size.w,
    h: size.h,
    minW: size.minW,
    maxW: size.maxW,
    minH: size.minH,
    maxH: size.maxH,
    isResizable: true,
    isDraggable: true,
  };
};
