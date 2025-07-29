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
  storageKey?: string
): void => {
  if (!storageKey) return; // No storage if no key provided

  try {
    const state = {
      components,
      layout,
      chatMessages,
      timestamp: Date.now(),
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save layout state:", error);
  }
};

/**
 * Load layout state from localStorage
 */
export const loadLayoutState = (
  storageKey?: string
): {
  components: StoredComponentConfig[];
  layout: StoredLayoutItem[];
  chatMessages: Record<string, ChatMessage[]>;
} | null => {
  if (!storageKey) return null; // No loading if no key provided

  try {
    const stored = localStorage.getItem(storageKey);
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
export const clearAllPluginData = (storageKey?: string): void => {
  if (!storageKey) return; // No clearing if no key provided

  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Failed to clear plugin data:", error);
  }
};
