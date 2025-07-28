import type { ReactNode } from "react";

/**
 * Represents a draggable component in the dashboard
 */
export interface DraggableComponent {
  id: string;
  type: string;
  title: string;
  content: ReactNode;
}

/**
 * Layout item configuration for react-grid-layout
 */
export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  isResizable?: boolean;
  isDraggable?: boolean;
}

/**
 * Chat state configuration
 */
export interface ChatState {
  isOpen: boolean;
  componentId: string | null;
}

/**
 * Chat message structure
 */
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

/**
 * Props for the MasterLayout component
 */
export interface MasterLayoutProps {
  children?: ReactNode[];
  components?: DraggableComponent[];
  onComponentRemove?: (componentId: string) => void;
  onUpdateComponent?: (
    componentId: string,
    updates: Partial<DraggableComponent>
  ) => void;
  onAddComponentToDashboard?: (component: DraggableComponent) => void;
  onRestoreComponents?: (components: DraggableComponent[]) => void;
}

/**
 * Ref interface for MasterLayout
 */
export interface MasterLayoutRef {
  addLayoutItem: (component: DraggableComponent) => void;
  removeLayoutItem: (id: string) => void;
}

/**
 * Stored component configuration for persistence
 */
export interface StoredComponentConfig {
  id: string;
  type: string;
  title: string;
}

/**
 * Stored layout item for persistence
 */
export interface StoredLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  isResizable?: boolean;
  isDraggable?: boolean;
}

/**
 * Plugin configuration interface
 */
export interface MasterLayoutPluginConfig {
  enableChat?: boolean;
  enablePersistence?: boolean;
  defaultGridCols?: number;
  defaultRowHeight?: number;
  containerPadding?: [number, number];
  margin?: [number, number];
}

/**
 * Plugin context interface
 */
export interface MasterLayoutPluginContext {
  layout: LayoutItem[];
  chatState: ChatState;
  containerWidth: number;
  addLayoutItem: (component: DraggableComponent) => void;
  removeLayoutItem: (id: string) => void;
  toggleChat: (componentId: string) => void;
  addMessageToComponent: (componentId: string, message: ChatMessage) => void;
}
