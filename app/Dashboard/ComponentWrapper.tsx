import React from "react";
import AIChatComponent from "./AIChatComponent";
import type { DraggableComponent } from "./ComponentLibrary";

interface ComponentWrapperProps {
  componentId: string;
  componentTitle: string;
  onRemove: (componentId: string) => void;
  onUpdateComponent: (
    componentId: string,
    updates: Partial<DraggableComponent>
  ) => void;
  onToggleChat: (componentId: string) => void;
  isChatOpen: boolean;
  chatMessages: any[];
  onAddMessage: (message: any) => void;
  onAddComponentToDashboard: (component: DraggableComponent) => void;
  children: React.ReactNode;
}

const ComponentWrapper: React.FC<ComponentWrapperProps> = ({
  componentId,
  componentTitle,
  onRemove,
  onToggleChat,
  isChatOpen,
  children,
}) => {
  // Props validation
  if (!componentId) {
    console.error("ComponentWrapper: componentId prop is required");
    return null;
  }

  return (
    <div
      data-component-id={componentId}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* App Bar */}
      <div
        style={{
          height: "32px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px",
          fontSize: "12px",
          color: "#666",
          flexShrink: 0,
        }}
      >
        <div style={{ fontWeight: "500" }}>{componentTitle || componentId}</div>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggleChat(componentId);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{
              background: isChatOpen ? "#e3f2fd" : "transparent",
              border: "none",
              fontSize: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              borderRadius: "4px",
              position: "relative",
              zIndex: 10,
            }}
            title="Chat with component"
          >
            💬
          </button>
          <button
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(componentId);
            }}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              borderRadius: "4px",
            }}
            title="Remove component"
          >
            ×
          </button>
        </div>
      </div>

      {/* Component Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "8px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ComponentWrapper;
