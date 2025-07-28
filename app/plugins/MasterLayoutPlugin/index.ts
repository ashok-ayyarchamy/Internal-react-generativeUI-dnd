// Main plugin exports
export { default as MasterLayout } from "./components/MasterLayout";

// Hook exports
export { useLayoutState } from "./hooks/useLayoutState";
export { useChatManagement } from "./hooks/useChatManagement";
export { useContainerManagement } from "./hooks/useContainerManagement";

// Utility exports
export * from "./utils/storage";
export * from "./utils/layout";
export * from "./utils/componentUtils";

// Type and interface exports
export * from "./interfaces";

// Plugin configuration
export const PLUGIN_CONFIG = {
  name: "MasterLayoutPlugin",
  version: "1.0.0",
  description:
    "A comprehensive layout management system with drag-and-drop, persistence, and chat integration",
  author: "AI SDK Team",
  dependencies: ["react-grid-layout"],
} as const;

// Default plugin configuration
export const DEFAULT_PLUGIN_CONFIG = {
  enableChat: true,
  enablePersistence: true,
  defaultGridCols: 12,
  defaultRowHeight: 40,
  containerPadding: [8, 8] as [number, number],
  margin: [8, 8] as [number, number],
} as const;
