import React, { useState, useEffect, useCallback, useRef } from "react";
import type {
  LayoutItem,
  DraggableComponent,
  ChatState,
  ChatMessage,
  ComponentRegistry,
} from "../interfaces";
import { createLayoutItem } from "../utils/layout";
import { recreateComponentContent } from "../utils/componentUtils";
import {
  saveLayoutState,
  loadLayoutState,
  serializeComponent,
} from "../utils/storage";

/**
 * Custom hook for managing layout state
 */
export const useLayoutState = (
  components: DraggableComponent[],
  onRestoreComponents?: (components: DraggableComponent[]) => void,
  storageKey?: string,
  componentRegistry?: ComponentRegistry
) => {
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    componentId: null,
  });
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Use ref to store chat messages persistently
  const chatMessagesRef = useRef<Map<string, ChatMessage[]>>(new Map());

  // Flag to prevent saving during initial load
  const isInitialLoadRef = useRef(true);

  // Load saved layout and components on mount
  useEffect(() => {
    // Only run once on mount
    if (!isInitialLoadRef.current) {
      return;
    }

    // Only load if storage key is provided
    if (storageKey) {
      const savedState = loadLayoutState(storageKey);
      if (savedState) {
        // Restore layout
        setLayout(savedState.layout);

        // Restore components by recreating them from the saved config
        if (savedState.components && savedState.components.length > 0) {
          const restoredComponents = savedState.components.map(
            (storedConfig) => ({
              id: storedConfig.id,
              type: storedConfig.type,
              title: storedConfig.title,
              content: recreateComponentContent(
                storedConfig.type,
                storedConfig.title,
                componentRegistry
              ),
            })
          );

          // Notify parent component about the restored components
          onRestoreComponents?.(restoredComponents);
        }

        // Load chat messages from saved state
        if (savedState.chatMessages) {
          Object.entries(savedState.chatMessages).forEach(
            ([componentId, messages]) => {
              chatMessagesRef.current.set(componentId, messages);
            }
          );
        }
      }
    }

    // Mark initial load as complete
    isInitialLoadRef.current = false;
    setIsInitialLoadComplete(true);
  }, [onRestoreComponents, storageKey, componentRegistry]);

  // Save layout and components whenever they change
  useEffect(() => {
    // Don't save during initial load to prevent loops
    if (isInitialLoadRef.current) {
      return;
    }

    // Only save if storage key is provided and we have meaningful data
    if (storageKey && (components.length > 0 || layout.length > 0)) {
      const serializedComponents = components.map(serializeComponent);

      // Convert chat messages ref to object
      const chatMessagesObj: Record<string, ChatMessage[]> = {};
      chatMessagesRef.current.forEach((messages, componentId) => {
        chatMessagesObj[componentId] = messages;
      });

      saveLayoutState(
        serializedComponents,
        layout,
        chatMessagesObj,
        storageKey
      );
    }
  }, [components, layout, chatState, storageKey]);

  // Sync layout with components
  useEffect(() => {
    // Don't sync during initial load to prevent overwriting restored layout
    if (!isInitialLoadComplete) {
      return;
    }

    const newLayoutItems = components
      .filter((comp) => !layout.some((layoutItem) => layoutItem.i === comp.id))
      .map((component) => createLayoutItem(component, layout));

    if (newLayoutItems.length > 0) {
      setLayout((prev) => [...prev, ...newLayoutItems]);
    }
  }, [components, layout, isInitialLoadComplete]);

  const addLayoutItem = useCallback(
    (component: DraggableComponent) => {
      // Check if component already exists in layout
      if (layout.find((item) => item.i === component.id)) {
        return; // Component already exists
      }

      const newLayoutItem = createLayoutItem(component, layout);
      setLayout((prev) => [...prev, newLayoutItem]);
    },
    [layout]
  );

  const removeLayoutItem = useCallback(
    (id: string) => {
      setLayout((prev) => prev.filter((item) => item.i !== id));

      // Remove from local chat messages ref
      chatMessagesRef.current.delete(id);
    },
    [storageKey]
  );

  const updateChatState = useCallback((newChatState: ChatState) => {
    setChatState(newChatState);
  }, []);

  const addMessageToComponent = useCallback(
    (componentId: string, message: ChatMessage) => {
      if (componentId) {
        const messages = chatMessagesRef.current.get(componentId) || [];
        const newMessages = [...messages, message];
        chatMessagesRef.current.set(componentId, newMessages);
      }
    },
    []
  );

  const getChatMessages = useCallback((componentId: string) => {
    return chatMessagesRef.current.get(componentId) || [];
  }, []);

  return {
    layout,
    setLayout,
    chatState,
    updateChatState,
    addLayoutItem,
    removeLayoutItem,
    addMessageToComponent,
    getChatMessages,
    isInitialLoadComplete,
  };
};
