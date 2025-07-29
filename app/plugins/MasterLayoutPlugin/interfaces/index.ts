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
 * Component registry - simply an array of available components
 */
export type ComponentRegistry = DraggableComponent[];

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
 * Props for the DynoChatLayout component
 */
export interface DynoChatLayoutProps {
  children?: ReactNode[];
  storageKey?: string; // Optional storage key for persistence
  componentRegistry?: ComponentRegistry; // External component registry
  onLayoutChange?: (layoutDetails: {
    layout: LayoutItem[];
    components: DraggableComponent[];
  }) => void;
  onAddNewComponent?: (componentDetails: {
    id: string;
    type: string;
    title: string;
  }) => void;
  onComponentUpdate?: (updateDetails: {
    id: string;
    type: string;
    title: string;
    updates: Partial<DraggableComponent>;
  }) => void;
}

/**
 * Ref interface for DynoChatLayout
 */
export interface DynoChatLayoutRef {
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
