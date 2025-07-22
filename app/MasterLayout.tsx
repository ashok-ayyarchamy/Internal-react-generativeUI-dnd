import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
} from "react";
import ResponsiveGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import type { DraggableComponent } from "./Dashboard/ComponentLibrary";
import ComponentChat from "./Dashboard/ComponentChat";
import AIChatComponent from "./Dashboard/AIChatComponent";

interface MasterLayoutProps {
  children?: React.ReactNode[];
  components?: DraggableComponent[];
  onComponentRemove?: (componentId: string) => void;
  onUpdateComponent?: (
    componentId: string,
    updates: Partial<DraggableComponent>
  ) => void;
}

interface LayoutItem {
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

interface State {
  layout: LayoutItem[];
  components: DraggableComponent[];
}

export interface MasterLayoutRef {
  addLayoutItem: (component: DraggableComponent) => void;
  removeLayoutItem: (id: string) => void;
}

const MasterLayout = forwardRef<MasterLayoutRef, MasterLayoutProps>(
  (
    { children, components = [], onComponentRemove, onUpdateComponent },
    ref
  ) => {
    const [openChats, setOpenChats] = useState<Set<string>>(new Set());
    const [state, setState] = useState<State>({ layout: [], components: [] });

    // Initialize state with components prop
    useEffect(() => {
      if (components.length > 0 && state.components.length === 0) {
        setState({ layout: [], components });
      }
    }, [components, state.components.length]);

    const calculateOptimalPosition = (component: DraggableComponent) => {
      const { layout } = state;
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x <= 12 - component.size.w; x++) {
          const newItem = { x, y, w: component.size.w, h: component.size.h };
          if (
            !layout.some(
              (existing) =>
                newItem.x < existing.x + existing.w &&
                newItem.x + newItem.w > existing.x &&
                newItem.y < existing.y + existing.h &&
                newItem.y + newItem.h > existing.y
            )
          ) {
            return { x, y };
          }
        }
      }
      return {
        x: 0,
        y: layout.length
          ? Math.max(...layout.map((item) => item.y + item.h))
          : 0,
      };
    };

    const calculateOptimalSize = (component: DraggableComponent) => {
      return {
        w: component.size.w,
        h: component.size.h,
        minW: component.minSize?.w || 1,
        maxW: component.maxSize?.w || 12,
        minH: component.minSize?.h || 1,
        maxH: component.maxSize?.h || 12,
      };
    };

    const addLayoutItem = useCallback(
      (component: DraggableComponent) => {
        // Check if component already exists
        if (state.components.find((c) => c.id === component.id)) {
          return; // Component already exists
        }

        const position = calculateOptimalPosition(component);
        const size = calculateOptimalSize(component);
        const newLayoutItem: LayoutItem = {
          i: component.id,
          x: position.x,
          y: position.y,
          w: size.w,
          h: size.h,
          minW: size.minW,
          maxW: size.maxW,
          minH: size.minH,
          maxH: size.maxH,
          isResizable: true,
          isDraggable: true,
        };
        setState((prevState) => ({
          layout: [...prevState.layout, newLayoutItem],
          components: [...prevState.components, component],
        }));
      },
      [state.layout, state.components]
    );

    const toggleChat = (componentId: string) => {
      console.log("Toggle chat for component:", componentId);
      setOpenChats((prev) => {
        const newSet = new Set(prev);
        newSet.has(componentId)
          ? newSet.delete(componentId)
          : newSet.add(componentId);
        console.log("Updated open chats:", Array.from(newSet));
        return newSet;
      });
    };

    // Clean up chat states when components are removed
    const removeLayoutItem = useCallback(
      (id: string) => {
        setState((prevState) => ({
          layout: prevState.layout.filter((item) => item.i !== id),
          components: prevState.components.filter((comp) => comp.id !== id),
        }));

        // Clean up chat state for removed component
        setOpenChats((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });

        onComponentRemove?.(id);
      },
      [onComponentRemove]
    );

    const handleComponentUpdate = (
      componentId: string,
      updates: Partial<DraggableComponent>
    ) => {
      setState((prev) => {
        const updatedComponents = prev.components.map((component) =>
          component.id === componentId
            ? { ...component, ...updates }
            : component
        );
        const updatedLayout = updates.size
          ? prev.layout.map((item) =>
              item.i === componentId
                ? { ...item, w: updates.size!.w, h: updates.size!.h }
                : item
            )
          : prev.layout;
        return {
          ...prev,
          components: updatedComponents,
          layout: updatedLayout,
        };
      });
      onUpdateComponent?.(componentId, updates);
    };

    useImperativeHandle(ref, () => ({ addLayoutItem, removeLayoutItem }));

    const onLayoutChange = useCallback(
      (newLayout: LayoutItem[]) =>
        setState((prev) => ({ ...prev, layout: newLayout })),
      []
    );

    const { layout, components: stateComponents } = state;
    const allComponents = [
      ...(children || []).map((child, index) => ({
        id: layout[index]?.i || `child-${index}`,
        content: child,
      })),
      ...stateComponents.map((component) => ({
        id: component.id,
        content: component.content,
      })),
    ];

    return (
      <div>
        <ResponsiveGridLayout
          width={window.innerWidth}
          className="layout"
          rowHeight={40}
          isDraggable
          isResizable
          cols={12}
          layout={layout}
          onLayoutChange={onLayoutChange}
          style={{ minHeight: "100vh" }}
        >
          {allComponents.map((component) => (
            <div
              key={component.id}
              style={{
                border: "1px solid #ccc",
                cursor: "move",
                position: "relative",
                backgroundColor: "#f8f8f8",
                overflow: "hidden",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  zIndex: 1000,
                  display: "flex",
                  gap: "4px",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log(
                      "Chat button clicked for component:",
                      component.id
                    );
                    toggleChat(component.id);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  style={{
                    background: "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "2px",
                    width: "24px",
                    height: "24px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1001,
                  }}
                  title="Chat with component"
                >
                  💬
                </button>
                <button
                  data-no-drag="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    removeLayoutItem(component.id);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  style={{
                    background: "#ff6b6b",
                    color: "white",
                    border: "1px solid #ff5252",
                    borderRadius: "2px",
                    width: "24px",
                    height: "24px",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1001,
                  }}
                  title="Remove component"
                >
                  ×
                </button>
              </div>
              <div
                style={{
                  padding: "4px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {component.content}
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>

        {/* Chat popup positioned relative to component positions */}
        {Array.from(openChats).map((componentId) => {
          const component = stateComponents.find((c) => c.id === componentId);
          if (!component) return null;

          // Find the layout item for this component
          const layoutItem = layout.find((item) => item.i === componentId);
          if (!layoutItem) return null;

          // Calculate component position on screen
          const gridContainer = document.querySelector(".layout");
          const gridRect = gridContainer?.getBoundingClientRect();

          if (!gridRect) {
            // Fallback to center if grid not found
            return (
              <div
                key={`chat-popup-${componentId}`}
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1001,
                  width: "300px",
                  height: "350px",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {component.type === "empty" ? (
                  <AIChatComponent
                    key={`ai-chat-${componentId}`}
                    isMinimized={false}
                    onToggleMinimize={() => toggleChat(componentId)}
                    onAddComponentToDashboard={(newComponent) => {
                      const replacementComponent = {
                        ...newComponent,
                        id: `${newComponent.type}-${Math.floor(
                          Math.random() * 10000
                        )}`,
                      };
                      toggleChat(componentId);
                      setTimeout(() => {
                        setState((prev) => {
                          const emptyComponent = prev.components.find(
                            (c) => c.id === componentId
                          );
                          if (!emptyComponent) return prev;
                          return {
                            layout: prev.layout.map((item) =>
                              item.i === componentId
                                ? { ...item, i: replacementComponent.id }
                                : item
                            ),
                            components: prev.components.map((comp) =>
                              comp.id === componentId
                                ? replacementComponent
                                : comp
                            ),
                          };
                        });
                      }, 150);
                    }}
                    dashboardComponents={stateComponents}
                  />
                ) : (
                  <ComponentChat
                    key={`component-chat-${componentId}`}
                    componentId={componentId}
                    componentTitle={component.title || "Dashboard Component"}
                    isOpen
                    onToggle={() => toggleChat(componentId)}
                    onUpdateComponent={handleComponentUpdate}
                  />
                )}
              </div>
            );
          }

          const cellWidth = gridRect.width / 12;
          const cellHeight = 40; // rowHeight
          const margin = 10;

          const componentLeft =
            gridRect.left + layoutItem.x * cellWidth + margin;
          const componentTop =
            gridRect.top + layoutItem.y * cellHeight + margin;
          const componentWidth = layoutItem.w * cellWidth - margin;
          const componentHeight = layoutItem.h * cellHeight - margin;

          // Position chat close to the component (top-right corner)
          const chatLeft = componentLeft + componentWidth - 300; // 300px is chat width
          const chatTop = componentTop - 350; // 350px above component

          // Ensure chat doesn't go off-screen
          const finalChatLeft = Math.max(
            10,
            Math.min(chatLeft, window.innerWidth - 310)
          );
          const finalChatTop = Math.max(10, chatTop);

          return (
            <div
              key={`chat-popup-${componentId}`}
              style={{
                position: "fixed",
                top: `${finalChatTop}px`,
                left: `${finalChatLeft}px`,
                zIndex: 1001,
                width: "300px",
                height: "350px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {component.type === "empty" ? (
                <AIChatComponent
                  key={`ai-chat-${componentId}`}
                  isMinimized={false}
                  onToggleMinimize={() => toggleChat(componentId)}
                  onAddComponentToDashboard={(newComponent) => {
                    // Create a new instance with unique ID
                    const replacementComponent = {
                      ...newComponent,
                      id: `${newComponent.type}-${Math.floor(
                        Math.random() * 10000
                      )}`,
                    };

                    // Close the chat first
                    toggleChat(componentId);

                    // Replace the empty component with a delay to ensure proper state update
                    setTimeout(() => {
                      setState((prev) => {
                        // Find the empty component to replace
                        const emptyComponent = prev.components.find(
                          (c) => c.id === componentId
                        );
                        if (!emptyComponent) return prev;

                        return {
                          layout: prev.layout.map((item) =>
                            item.i === componentId
                              ? { ...item, i: replacementComponent.id }
                              : item
                          ),
                          components: prev.components.map((comp) =>
                            comp.id === componentId
                              ? replacementComponent
                              : comp
                          ),
                        };
                      });
                    }, 150);
                  }}
                  dashboardComponents={stateComponents}
                />
              ) : (
                <ComponentChat
                  key={`component-chat-${componentId}`}
                  componentId={componentId}
                  componentTitle={component.title || "Dashboard Component"}
                  isOpen
                  onToggle={() => toggleChat(componentId)}
                  onUpdateComponent={handleComponentUpdate}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

MasterLayout.displayName = "MasterLayout";

export default MasterLayout;
