import React, { forwardRef, useImperativeHandle, useCallback, useState } from "react";
import ResponsiveGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";

import type {
  DynoChatLayoutProps,
  DynoChatLayoutRef,
  DraggableComponent,
  LayoutItem,
} from "../interfaces";
import { useLayoutState } from "../hooks/useLayoutState";
import { useChatManagement } from "../hooks/useChatManagement";
import { useContainerManagement } from "../hooks/useContainerManagement";
import { calculateChatPosition } from "../utils/layout";
import ComponentWrapper from "../../../Dashboard/ComponentWrapper";
import AIChatComponent from "../../../Dashboard/AIChatComponent";

/**
 * DynoChatLayout Plugin Component
 *
 * A comprehensive layout management system that provides:
 * - Drag and drop grid layout
 * - Component persistence
 * - Chat integration
 * - Responsive design
 * - State management
 * - Built-in empty component creation
 */
const DynoChatLayout = forwardRef<DynoChatLayoutRef, DynoChatLayoutProps>(
  (
    {
      onLayoutChange,
      onAddNewComponent,
      onComponentUpdate,
    },
    ref
  ) => {
    // Internal component state
    const [components, setComponents] = useState<DraggableComponent[]>([]);

    // Custom hooks for state management
    const {
      layout,
      setLayout,
      chatState,
      updateChatState,
      addLayoutItem,
      removeLayoutItem,
      addMessageToComponent,
      getChatMessages,
      isInitialLoadComplete,
    } = useLayoutState(components, (restoredComponents) => {
      setComponents(restoredComponents);
    });

    const { toggleChat, handleAddComponentToDashboard, addMessageToHistory } =
      useChatManagement(
        chatState,
        updateChatState,
        addMessageToComponent,
        getChatMessages,
        (componentId, updates) => {
          setComponents(prev => 
            prev.map(comp => 
              comp.id === componentId ? { ...comp, ...updates } : comp
            )
          );
          onComponentUpdate?.({
            id: componentId,
            type: components.find(c => c.id === componentId)?.type || '',
            title: components.find(c => c.id === componentId)?.title || '',
            updates
          });
        }
      );

    const { containerWidth, containerHeight, containerRef } =
      useContainerManagement(layout);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({ addLayoutItem, removeLayoutItem }));

    // Handle adding empty component
    const handleAddEmptyComponent = useCallback(() => {
      const emptyComponent: DraggableComponent = {
        id: `empty-${Math.floor(Math.random() * 10000)}`,
        type: "empty",
        title: "Select Component",
        content: (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#666",
              fontSize: "14px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8f9fa",
              border: "2px dashed #dee2e6",
            }}
          >
            Click the chat button to select a component
          </div>
        ),
      };

      // Add the empty component to the layout
      addLayoutItem(emptyComponent);
      setComponents(prev => [...prev, emptyComponent]);
      
      // Notify parent about new component
      onAddNewComponent?.({
        id: emptyComponent.id,
        type: emptyComponent.type,
        title: emptyComponent.title,
      });
    }, [addLayoutItem, onAddNewComponent]);

    // Layout change handlers
    const handleLayoutChange = useCallback(
      (newLayout: LayoutItem[]) => {
        setLayout(newLayout);
        onLayoutChange?.({
          layout: newLayout,
          components: components,
        });
      },
      [setLayout, components, onLayoutChange]
    );

    const onResize = useCallback(
      (layout: LayoutItem[]) => {
        setLayout(layout);
      },
      [setLayout]
    );

    // Calculate chat position
    const getChatPosition = useCallback(() => {
      return calculateChatPosition(
        chatState.componentId,
        layout,
        containerWidth,
        containerRef.current?.getBoundingClientRect() || null
      );
    }, [chatState.componentId, layout, containerWidth]);

    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: containerHeight,
          position: "relative",
          overflow: "visible",
        }}
      >
        <ResponsiveGridLayout
          width={containerWidth}
          rowHeight={40}
          isDraggable
          isResizable
          cols={12}
          layout={layout}
          onLayoutChange={handleLayoutChange}
          onResize={onResize}
          margin={[8, 8]}
          containerPadding={[8, 8]}
          style={{
            minHeight: `${containerHeight}px`,
            overflow: "visible",
          }}
        >
          {components.map((component) => (
            <div key={component.id} style={{ width: "100%", height: "100%" }}>
              <ComponentWrapper
                componentId={component.id}
                componentTitle={component.title}
                onRemove={(componentId) => {
                  removeLayoutItem(componentId);
                  setComponents(prev => prev.filter(c => c.id !== componentId));
                }}
                onUpdateComponent={(id, updates) => {
                  setComponents(prev => 
                    prev.map(comp => 
                      comp.id === id ? { ...comp, ...updates } : comp
                    )
                  );
                  onComponentUpdate?.({
                    id,
                    type: components.find(c => c.id === id)?.type || '',
                    title: components.find(c => c.id === id)?.title || '',
                    updates
                  });
                }}
                onToggleChat={toggleChat}
                isChatOpen={
                  chatState.isOpen && chatState.componentId === component.id
                }
                chatMessages={getChatMessages(component.id)}
                onAddMessage={addMessageToHistory}
                onAddComponentToDashboard={handleAddComponentToDashboard}
              >
                {component.content}
              </ComponentWrapper>
            </div>
          ))}
        </ResponsiveGridLayout>

        {/* Chat Popup - Positioned at document level but calculated from component position */}
        {chatState.isOpen && chatState.componentId && (
          <div
            style={{
              position: "fixed",
              zIndex: 1001,
              width: "300px",
              height: "350px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              ...getChatPosition(),
            }}
          >
            <AIChatComponent
              key={`ai-chat-${chatState.componentId}`}
              componentId={chatState.componentId}
              isMinimized={false}
              onToggleMinimize={() => toggleChat(chatState.componentId!)}
              messages={getChatMessages(chatState.componentId)}
              onAddMessage={(message) =>
                addMessageToComponent(chatState.componentId!, message)
              }
              onAddComponentToDashboard={handleAddComponentToDashboard}
            />
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={handleAddEmptyComponent}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "50px",
            height: "50px",
            borderRadius: "25px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.backgroundColor = "#0056b3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "#007bff";
          }}
          title="Add new component"
        >
          +
        </button>
      </div>
    );
  }
);

DynoChatLayout.displayName = "DynoChatLayout";

export default DynoChatLayout;
