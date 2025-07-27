import type { DraggableComponent } from "~/Dashboard/ComponentLibrary";
import type React from "react";

// Component configuration interface for JSON storage
export interface ComponentConfig {
  id: string;
  type: string;
  title: string;
  data?: {
    chartData?: any;
    tableData?: any;
    cardData?: any;
    metricData?: any;
    gaugeData?: any;
    activityData?: any;
  };
  chatMetadata?: {
    lastMessageTime?: number;
    messageCount?: number;
  };
}

// Layout item interface
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

// Complete dashboard state for localStorage
export interface SavedDashboardState {
  version: string;
  timestamp: number;
  components: ComponentConfig[];
  layout: LayoutItem[];
  chatMessages: Record<string, any[]>;
  chatState: {
    isOpen: boolean;
    componentId: string | null;
  };
}

// LocalStorage keys
const DASHBOARD_STATE_KEY = "dashboard_state";
const CHAT_MESSAGES_KEY = "dashboard_chat_messages";
const CHAT_STATE_KEY = "dashboard_chat_state";

// Current version for migration support
const CURRENT_VERSION = "1.0.0";

// Utility functions
export const isLocalStorageAvailable = (): boolean => {
  // Check if we're on the client side
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Save complete dashboard state
export const saveDashboardState = (
  components: ComponentConfig[],
  layout: LayoutItem[],
  chatMessages: Record<string, any[]>,
  chatState: { isOpen: boolean; componentId: string | null }
): void => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available");
    return;
  }

  try {
    const state: SavedDashboardState = {
      version: CURRENT_VERSION,
      timestamp: Date.now(),
      components,
      layout,
      chatMessages,
      chatState,
    };

    console.log("Saving dashboard state:", state);
    localStorage.setItem(DASHBOARD_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save dashboard state:", error);
  }
};

// Load complete dashboard state
export const loadDashboardState = (): SavedDashboardState | null => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available");
    return null;
  }

  try {
    const saved = localStorage.getItem(DASHBOARD_STATE_KEY);
    if (!saved) return null;

    const state: SavedDashboardState = JSON.parse(saved);

    // Version migration logic can be added here in the future
    if (state.version !== CURRENT_VERSION) {
      console.warn(
        `Dashboard state version mismatch. Expected: ${CURRENT_VERSION}, Got: ${state.version}`
      );
    }
    console.log("Loaded dashboard state:", state);
    return state;
  } catch (error) {
    console.error("Failed to load dashboard state:", error);
    return null;
  }
};

// Save individual component config
export const saveComponentConfig = (component: ComponentConfig): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    const state = loadDashboardState();
    if (!state) return;

    const updatedComponents = state.components.map((c) =>
      c.id === component.id ? component : c
    );

    saveDashboardState(
      updatedComponents,
      state.layout,
      state.chatMessages,
      state.chatState
    );
  } catch (error) {
    console.error("Failed to save component config:", error);
  }
};

// Load component config by ID
export const loadComponentConfig = (id: string): ComponentConfig | null => {
  const state = loadDashboardState();
  if (!state) return null;

  return state.components.find((c) => c.id === id) || null;
};

// Save chat messages for a specific component
export const saveChatMessages = (
  componentId: string,
  messages: any[]
): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    const state = loadDashboardState();
    if (!state) return;

    const updatedChatMessages = {
      ...state.chatMessages,
      [componentId]: messages,
    };

    saveDashboardState(
      state.components,
      state.layout,
      updatedChatMessages,
      state.chatState
    );
  } catch (error) {
    console.error("Failed to save chat messages:", error);
  }
};

// Load chat messages for a specific component
export const loadChatMessages = (componentId: string): any[] => {
  const state = loadDashboardState();
  if (!state) return [];

  const messages = state.chatMessages[componentId] || [];

  // Convert string timestamps back to Date objects
  return messages.map((message) => ({
    ...message,
    timestamp:
      typeof message.timestamp === "string"
        ? new Date(message.timestamp)
        : message.timestamp,
  }));
};

// Remove chat messages when component is deleted
export const removeChatMessages = (componentId: string): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    const state = loadDashboardState();
    if (!state) return;

    const { [componentId]: removed, ...remainingMessages } = state.chatMessages;

    saveDashboardState(
      state.components,
      state.layout,
      remainingMessages,
      state.chatState
    );
  } catch (error) {
    console.error("Failed to remove chat messages:", error);
  }
};

// Save chat state (open/closed, which component)
export const saveChatState = (chatState: {
  isOpen: boolean;
  componentId: string | null;
}): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    const state = loadDashboardState();
    if (!state) return;

    saveDashboardState(
      state.components,
      state.layout,
      state.chatMessages,
      chatState
    );
  } catch (error) {
    console.error("Failed to save chat state:", error);
  }
};

// Load chat state
export const loadChatState = (): {
  isOpen: boolean;
  componentId: string | null;
} => {
  const state = loadDashboardState();
  if (!state) return { isOpen: false, componentId: null };

  return state.chatState;
};

// Clear all dashboard data
export const clearDashboardData = (): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(DASHBOARD_STATE_KEY);
    localStorage.removeItem(CHAT_MESSAGES_KEY);
    localStorage.removeItem(CHAT_STATE_KEY);
  } catch (error) {
    console.error("Failed to clear dashboard data:", error);
  }
};

// ===== NEW LAYOUT AND COMPONENT STORAGE =====

// Component configuration for localStorage (without React components)
export interface StoredComponentConfig {
  id: string;
  type: string;
  title: string;
  data?: {
    chartData?: any;
    tableData?: any;
    cardData?: any;
    metricData?: any;
    gaugeData?: any;
    activityData?: any;
  };
}

// Layout item for localStorage
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

// Complete dashboard state for localStorage
export interface StoredDashboardState {
  version: string;
  timestamp: number;
  components: StoredComponentConfig[];
  layout: StoredLayoutItem[];
}

// LocalStorage keys for layout and components
const LAYOUT_STATE_KEY = "dashboard_layout_state";
const CURRENT_LAYOUT_VERSION = "1.0.0";

// Save layout and component state
export const saveLayoutState = (
  components: StoredComponentConfig[],
  layout: StoredLayoutItem[]
): void => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available");
    return;
  }

  try {
    const state: StoredDashboardState = {
      version: CURRENT_LAYOUT_VERSION,
      timestamp: Date.now(),
      components,
      layout,
    };

    localStorage.setItem(LAYOUT_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save layout state:", error);
  }
};

// Load layout and component state
export const loadLayoutState = (): StoredDashboardState | null => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available");
    return null;
  }

  try {
    const saved = localStorage.getItem(LAYOUT_STATE_KEY);
    if (!saved) return null;

    const state: StoredDashboardState = JSON.parse(saved);

    // Version migration logic can be added here in the future
    if (state.version !== CURRENT_LAYOUT_VERSION) {
      console.warn(
        `Layout state version mismatch. Expected: ${CURRENT_LAYOUT_VERSION}, Got: ${state.version}`
      );
    }

    return state;
  } catch (error) {
    console.error("Failed to load layout state:", error);
    return null;
  }
};

// Convert DraggableComponent to StoredComponentConfig (removes React components)
export const serializeComponent = (
  component: DraggableComponent
): StoredComponentConfig => {
  return {
    id: component.id,
    type: component.type,
    title: component.title,

    // Note: We don't store the React component content
    // Component content will be recreated when deserializing
  };
};

// Convert StoredComponentConfig back to DraggableComponent (requires content recreation)
export const deserializeComponent = (
  config: StoredComponentConfig,
  content: React.ReactNode
): DraggableComponent => {
  return {
    id: config.id,
    type: config.type,
    title: config.title,
    content,
  };
};

// Clear layout data
export const clearLayoutData = (): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(LAYOUT_STATE_KEY);
  } catch (error) {
    console.error("Failed to clear layout data:", error);
  }
};
