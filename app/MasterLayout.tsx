import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import ResponsiveGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import type { DraggableComponent } from "./Dashboard/ComponentLibrary";
import ComponentWrapper from "./Dashboard/ComponentWrapper";
import AIChatComponent from "./Dashboard/AIChatComponent";

interface MasterLayoutProps {
  children?: React.ReactNode[];
  components?: DraggableComponent[];
  onComponentRemove?: (componentId: string) => void;
  onUpdateComponent?: (
    componentId: string,
    updates: Partial<DraggableComponent>
  ) => void;
  onAddComponentToDashboard?: (component: DraggableComponent) => void;
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

export interface MasterLayoutRef {
  addLayoutItem: (component: DraggableComponent) => void;
  removeLayoutItem: (id: string) => void;
}

const MasterLayout = forwardRef<MasterLayoutRef, MasterLayoutProps>(
  (
    {
      children,
      components = [],
      onComponentRemove,
      onUpdateComponent,
      onAddComponentToDashboard,
    },
    ref
  ) => {
    const [layout, setLayout] = useState<LayoutItem[]>([]);
    const [containerWidth, setContainerWidth] = useState(1200);
    const [chatState, setChatState] = useState<{
      isOpen: boolean;
      componentId: string | null;
    }>({
      isOpen: false,
      componentId: null,
    });

    // Use ref to store chat messages persistently
    const chatMessagesRef = useRef<Map<string, any[]>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate dynamic container height based on layout
    const calculateContainerHeight = useCallback(() => {
      if (layout.length === 0) return 600; // Default height

      const maxRow = Math.max(...layout.map((item) => item.y + item.h));
      const rowHeight = 40;
      const margin = 8;
      const containerPadding = 8;
      const minHeight = 600;

      const calculatedHeight =
        maxRow * rowHeight + (maxRow - 1) * margin + containerPadding * 2;
      return Math.max(calculatedHeight, minHeight);
    }, [layout]);

    // Calculate container width
    useEffect(() => {
      const updateWidth = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      };

      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const calculateOptimalPosition = useCallback(
      (component: DraggableComponent) => {
        // Calculate the maximum needed rows based on existing components and the new component
        const maxExistingRow =
          layout.length > 0
            ? Math.max(...layout.map((item) => item.y + item.h))
            : 0;
        const maxNeededRows = Math.max(maxExistingRow + component.size.h, 50); // Allow up to 50 rows by default

        for (let y = 0; y < maxNeededRows; y++) {
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
      },
      [layout]
    );

    const calculateOptimalSize = useCallback(
      (component: DraggableComponent) => {
        return {
          w: component.size.w,
          h: component.size.h,
          minW: component.minSize?.w || 1,
          maxW: component.maxSize?.w || 12,
          minH: component.minSize?.h || 1,
          maxH: component.maxSize?.h || 50, // Increased from 12 to 50 to allow taller components
        };
      },
      []
    );

    // Sync layout with components
    useEffect(() => {
      const newLayoutItems = components
        .filter(
          (comp) => !layout.some((layoutItem) => layoutItem.i === comp.id)
        )
        .map((component) => {
          const position = calculateOptimalPosition(component);
          const size = calculateOptimalSize(component);
          return {
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
        });

      if (newLayoutItems.length > 0) {
        setLayout((prev) => [...prev, ...newLayoutItems]);
      }
    }, [components, layout, calculateOptimalPosition, calculateOptimalSize]);

    const addLayoutItem = useCallback(
      (component: DraggableComponent) => {
        // Check if component already exists in layout
        if (layout.find((item) => item.i === component.id)) {
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

        setLayout((prev) => [...prev, newLayoutItem]);
      },
      [layout, calculateOptimalPosition, calculateOptimalSize]
    );

    const removeLayoutItem = useCallback(
      (id: string) => {
        setLayout((prev) => prev.filter((item) => item.i !== id));
        onComponentRemove?.(id);
      },
      [onComponentRemove]
    );

    // Chat management functions
    const toggleChat = useCallback((componentId: string) => {
      setChatState((prev) => ({
        isOpen: !prev.isOpen || prev.componentId !== componentId,
        componentId: prev.componentId === componentId ? null : componentId,
      }));
    }, []);

    const addMessageToHistory = useCallback(
      (message: any) => {
        if (chatState.componentId) {
          const messages =
            chatMessagesRef.current.get(chatState.componentId) || [];
          chatMessagesRef.current.set(chatState.componentId, [
            ...messages,
            message,
          ]);
        }
      },
      [chatState.componentId]
    );

    const handleAddComponentToDashboard = useCallback(
      (newComponent: DraggableComponent) => {
        console.log("MasterLayout: Modifying component content:", newComponent);
        // Only modify the content of the current component, preserve chat state
        if (onUpdateComponent && chatState.componentId) {
          onUpdateComponent(chatState.componentId, {
            content: newComponent.content,
          });
          // Preserve chat messages after component update
          const messages =
            chatMessagesRef.current.get(chatState.componentId) || [];
          chatMessagesRef.current.set(chatState.componentId, messages);
        }
      },
      [onUpdateComponent, chatState.componentId]
    );

    // Calculate chat position based on component position
    const getChatPosition = useCallback(() => {
      if (!chatState.componentId) return { top: "50px", left: "50px" };

      const componentLayout = layout.find(
        (item) => item.i === chatState.componentId
      );
      if (!componentLayout) return { top: "50px", left: "50px" };

      // Calculate position based on grid layout
      const rowHeight = 40;
      const margin = 8;
      const containerPadding = 8;
      const appBarHeight = 32; // Height of the component's app bar

      const componentTop =
        componentLayout.y * rowHeight +
        componentLayout.y * margin +
        containerPadding;
      const componentLeft =
        (componentLayout.x / 12) * containerWidth +
        componentLayout.x * margin +
        containerPadding;

      // Get the container's position in the viewport
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return { top: "50px", left: "50px" };

      // Calculate absolute position in viewport
      const absoluteTop = containerRect.top + componentTop + appBarHeight; // Add app bar height
      const absoluteLeft = containerRect.left + componentLeft;

      // Position chat at the top-right corner of the component, below the app bar
      return {
        top: `${absoluteTop}px`,
        left: `${
          absoluteLeft + (componentLayout.w / 12) * containerWidth - 300
        }px`, // Align to right edge of component
      };
    }, [chatState.componentId, layout, containerWidth]);

    useImperativeHandle(ref, () => ({ addLayoutItem, removeLayoutItem }));

    const onLayoutChange = useCallback(
      (newLayout: LayoutItem[]) => setLayout(newLayout),
      []
    );

    // Debug logging
    console.log("MasterLayout render:", {
      layout,
      components,
      containerWidth,
      chatState,
    });

    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: calculateContainerHeight(),
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
          margin={[8, 8]}
          containerPadding={[8, 8]}
          style={{
            minHeight: `${calculateContainerHeight()}px`,
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
                chatMessages={chatMessagesRef.current.get(component.id) || []}
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
              isMinimized={false}
              onToggleMinimize={() => toggleChat(chatState.componentId!)}
              messages={
                chatMessagesRef.current.get(chatState.componentId) || []
              }
              onAddMessage={addMessageToHistory}
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
