import { useCallback } from "react";
import type {
  ChatState,
  ChatMessage,
  DraggableComponent,
  ComponentRegistry,
} from "../interfaces";
import { createComponentInstance } from "../utils/componentUtils";

/**
 * Custom hook for managing chat functionality
 */
export const useChatManagement = (
  chatState: ChatState,
  updateChatState: (newState: ChatState) => void,
  addMessageToComponent: (componentId: string, message: ChatMessage) => void,
  getChatMessages: (componentId: string) => ChatMessage[],
  onUpdateComponent?: (
    componentId: string,
    updates: Partial<DraggableComponent>
  ) => void,
  componentRegistry?: ComponentRegistry
) => {
  // Add welcome message when chat is first opened for a component
  const addWelcomeMessage = useCallback(
    (componentId: string) => {
      const welcomeMessage: ChatMessage = {
        id: "1",
        text: "Hello! I'm your AI assistant. I can help you add components to your dashboard. Try saying 'add chart', 'show components', or 'I need a data table'.",
        sender: "ai",
        timestamp: new Date(),
      };

      addMessageToComponent(componentId, welcomeMessage);
    },
    [addMessageToComponent]
  );

  // Chat management functions
  const toggleChat = useCallback(
    (componentId: string) => {
      const newState: ChatState = {
        isOpen: !chatState.isOpen || chatState.componentId !== componentId,
        componentId: chatState.componentId === componentId ? null : componentId,
      };

      updateChatState(newState);

      // Add welcome message only when opening chat for the first time and no messages exist
      if (newState.isOpen && newState.componentId === componentId) {
        // Check if there are already messages for this component
        const existingMessages = getChatMessages(componentId);
        if (existingMessages.length === 0) {
          addWelcomeMessage(componentId);
        }
      }
    },
    [
      chatState.isOpen,
      chatState.componentId,
      updateChatState,
      addWelcomeMessage,
      getChatMessages,
    ]
  );

  const handleAddComponentToDashboard = useCallback(
    (newComponent: DraggableComponent) => {
      if (onUpdateComponent) {
        // If there's a current component being updated (like an empty component)
        if (chatState.componentId) {
          // Update the existing component
          const updatedContent = createComponentInstance(
            newComponent.type,
            newComponent.title,
            componentRegistry
          );

          onUpdateComponent(chatState.componentId, {
            type: updatedContent.type,
            title: updatedContent.title,
            content: updatedContent.content,
          });
        } else {
          // Create a new component instance with a unique ID
          const componentInstance = createComponentInstance(
            newComponent.type,
            newComponent.title,
            componentRegistry
          );

          // This will be handled by the parent component to add the new component to the layout
          onUpdateComponent(componentInstance.id, componentInstance);
        }
      }
    },
    [onUpdateComponent, componentRegistry, chatState.componentId]
  );

  const addMessageToHistory = useCallback(
    (message: ChatMessage) => {
      // Always add message to the current component's chat history
      const componentId = chatState.componentId;
      if (componentId) {
        addMessageToComponent(componentId, message);
      }
    },
    [chatState.componentId, addMessageToComponent]
  );

  return {
    toggleChat,
    handleAddComponentToDashboard,
    addMessageToHistory,
    addWelcomeMessage,
  };
};
