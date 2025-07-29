import type {
  StoredComponentConfig,
  StoredLayoutItem,
  ChatMessage,
} from "../interfaces";

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
  chatMessages: Record<string, ChatMessage[]>,
  storageKey: string
): void => {
  try {
    const state = {
      components,
      layout,
      chatMessages,
      timestamp: Date.now(),
    };

    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    // Failed to save layout state
  }
};

/**
 * Load layout state from localStorage
 */
export const loadLayoutState = (
  storageKey: string
): {
  components: StoredComponentConfig[];
  layout: StoredLayoutItem[];
  chatMessages: Record<string, ChatMessage[]>;
} | null => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const state = JSON.parse(saved);

      // Convert timestamp strings back to Date objects for chat messages
      const chatMessages: Record<string, ChatMessage[]> = {};
      if (state.chatMessages) {
        Object.keys(state.chatMessages).forEach((componentId) => {
          chatMessages[componentId] = state.chatMessages[componentId].map(
            (msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })
          );
        });
      }

      return {
        components: state.components || [],
        layout: state.layout || [],
        chatMessages: chatMessages,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Clear all plugin data from localStorage
 */
export const clearPluginData = (storageKey: string): void => {
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    // Failed to clear plugin data
  }
};
