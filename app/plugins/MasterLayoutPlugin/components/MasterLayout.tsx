import React, { forwardRef, useImperativeHandle, useCallback } from "react";
import ResponsiveGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";

import type {
  MasterLayoutProps,
  MasterLayoutRef,
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
 * MasterLayout Plugin Component
 *
 * A comprehensive layout management system that provides:
 * - Drag and drop grid layout
 * - Component persistence
 * - Chat integration
 * - Responsive design
 * - State management
 */
const MasterLayout = forwardRef<MasterLayoutRef, MasterLayoutProps>(
  (
    {
      components = [],
      onComponentRemove,
      onUpdateComponent,
      onRestoreComponents,
      onAddComponentToDashboard,
    },
    ref
  ) => {
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
    } = useLayoutState(components, onRestoreComponents);

    const { toggleChat, handleAddComponentToDashboard, addMessageToHistory } =
      useChatManagement(
        chatState,
        updateChatState,
        addMessageToComponent,
        getChatMessages,
        onUpdateComponent
      );

    const { containerWidth, containerHeight, containerRef } =
      useContainerManagement(layout);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({ addLayoutItem, removeLayoutItem }));

    // Layout change handlers
    const onLayoutChange = useCallback(
      (newLayout: LayoutItem[]) => {
        setLayout(newLayout);
      },
      [setLayout]
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
          onLayoutChange={onLayoutChange}
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
                onRemove={removeLayoutItem}
                onUpdateComponent={
                  onUpdateComponent ||
                  ((id, updates) => {
                    console.warn(
                      "onUpdateComponent not provided to ComponentWrapper"
                    );
                  })
                }
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
      </div>
    );
  }
);

MasterLayout.displayName = "MasterLayout";

export default MasterLayout;
