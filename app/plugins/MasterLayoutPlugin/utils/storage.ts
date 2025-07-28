import type {
  StoredComponentConfig,
  StoredLayoutItem,
  ChatMessage,
} from "../interfaces";

const STORAGE_KEYS = {
  LAYOUT_STATE: "masterLayout_state",
} as const;

/**
 * Serialize a component for storage
 */
export const serializeComponent = (component: {
  id: string;
  type: string;
  title: string;
}): StoredComponentConfig => ({
  id: component.id,
  type: component.type,
  title: component.title,
});

/**
 * Deserialize a component from storage
 */
export const deserializeComponent = (
  stored: StoredComponentConfig
): StoredComponentConfig => ({
  id: stored.id,
  type: stored.type,
  title: stored.title,
});

/**
 * Save layout state to localStorage
 */
export const saveLayoutState = (
  components: StoredComponentConfig[],
  layout: StoredLayoutItem[],
  chatMessages: Record<string, ChatMessage[]>
): void => {
  try {
    const state = {
      components,
      layout,
      chatMessages,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.LAYOUT_STATE, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save layout state:", error);
  }
};

/**
 * Load layout state from localStorage
 */
export const loadLayoutState = (): {
  components: StoredComponentConfig[];
  layout: StoredLayoutItem[];
  chatMessages: Record<string, ChatMessage[]>;
} | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAYOUT_STATE);
    if (!stored) return null;

    const state = JSON.parse(stored);

    // Convert timestamp strings back to Date objects for chat messages
    if (state.chatMessages) {
      Object.keys(state.chatMessages).forEach((componentId) => {
        state.chatMessages[componentId] = state.chatMessages[componentId].map(
          (msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })
        );
      });
    }

    return state;
  } catch (error) {
    console.error("Failed to load layout state:", error);
    return null;
  }
};



/**
 * Clear all plugin data from localStorage
 */
export const clearAllPluginData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.LAYOUT_STATE);
  } catch (error) {
    console.error("Failed to clear plugin data:", error);
  }
};
