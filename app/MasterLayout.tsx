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
import {
  saveLayoutState,
  loadLayoutState,
  serializeComponent,
  deserializeComponent,
  type StoredComponentConfig,
  type StoredLayoutItem,
} from "./utils/localStorageUtils";
import { componentLibrary } from "./Dashboard/ComponentLibrary";

interface MasterLayoutProps {
  children?: React.ReactNode[];
  components?: DraggableComponent[];
  onComponentRemove?: (componentId: string) => void;
  onUpdateComponent?: (
    componentId: string,
    updates: Partial<DraggableComponent>
  ) => void;
  onAddComponentToDashboard?: (component: DraggableComponent) => void;
  onRestoreComponents?: (components: DraggableComponent[]) => void;
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
      components = [],
      onComponentRemove,
      onUpdateComponent,
      onRestoreComponents,
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

    // State to trigger re-renders when messages change
    const [chatMessagesState, setChatMessagesState] = useState<
      Map<string, any[]>
    >(new Map());

    // Flag to prevent saving during initial load
    const isInitialLoadRef = useRef(true);
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

    // Function to recreate component content based on type
    const recreateComponentContent = useCallback(
      (type: string, title: string): React.ReactNode => {
        // Find a template component of the same type
        const templateComponent = componentLibrary.find(
          (comp) => comp.type === type
        );

        if (templateComponent) {
          // Return the content directly since it already has the proper props
          return templateComponent.content;
        }

        // Fallback for unknown component types
        return (
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
            {title || `Unknown Component: ${type}`}
          </div>
        );
      },
      []
    );

    // Load saved layout and components on mount
    useEffect(() => {
      // Only run once on mount
      if (!isInitialLoadRef.current) {
        return;
      }

      const savedState = loadLayoutState();
      if (savedState) {
        // Restore layout
        setLayout(savedState.layout);

        // Restore components by recreating them from the saved config
        if (savedState.components && savedState.components.length > 0) {
          const restoredComponents = savedState.components.map(
            (storedConfig) => {
              const content = recreateComponentContent(
                storedConfig.type,
                storedConfig.title
              );
              return {
                id: storedConfig.id,
                type: storedConfig.type,
                title: storedConfig.title,
                content,
              };
            }
          );

          // Notify parent component about the restored components
          onRestoreComponents?.(restoredComponents);
        }

        console.log("MasterLayout: Saved state", savedState);
      }

      // Mark initial load as complete
      isInitialLoadRef.current = false;
      setIsInitialLoadComplete(true);
    }, [recreateComponentContent, onRestoreComponents]); // Add dependencies

    // Save layout and components whenever they change
    useEffect(() => {
      // Don't save during initial load to prevent loops
      if (isInitialLoadRef.current) {
        return;
      }

      // Only save if we have meaningful data and avoid saving empty states
      if (components.length > 0 || layout.length > 0) {
        const serializedComponents = components.map(serializeComponent);
        console.log(
          "MasterLayout: Saving layout with",
          serializedComponents,
          "components and",
          layout,
          "layout items"
        );
        saveLayoutState(serializedComponents, layout);
      }
    }, [components, layout]);

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
        const maxNeededRows = Math.max(maxExistingRow + 2, 50); // Default height of 2, allow up to 50 rows

        for (let y = 0; y < maxNeededRows; y++) {
          for (let x = 0; x <= 12 - 2; x++) {
            // Default width of 2
            const newItem = { x, y, w: 2, h: 2 }; // Default width and height of 2
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
          w: 2, // Default width
          h: 2, // Default height
          minW: 1,
          maxW: 12,
          minH: 1,
          maxH: 50, // Allow up to 50 rows for taller components
        };
      },
      []
    );

    // Sync layout with components
    useEffect(() => {
      // Don't sync during initial load to prevent overwriting restored layout
      if (!isInitialLoadComplete) {
        return;
      }

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
    }, [
      components,
      layout,
      calculateOptimalPosition,
      calculateOptimalSize,
      isInitialLoadComplete,
    ]);

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
        // Layout changes are automatically saved by the useEffect above
      },
      [layout, calculateOptimalPosition, calculateOptimalSize]
    );

    const removeLayoutItem = useCallback(
      (id: string) => {
        setLayout((prev) => prev.filter((item) => item.i !== id));
        onComponentRemove?.(id);
        // Layout changes are automatically saved by the useEffect above
      },
      [onComponentRemove]
    );

    // Add welcome message when chat is first opened for a component
    const addWelcomeMessage = useCallback((componentId: string) => {
      const existingMessages = chatMessagesRef.current.get(componentId) || [];
      if (existingMessages.length === 0) {
        const welcomeMessage = {
          id: "1",
          text: "Hello! I'm your AI assistant. I can help you add components to your dashboard. Try saying 'add chart', 'show components', or 'I need a data table'.",
          sender: "ai",
          timestamp: new Date(),
        };
        chatMessagesRef.current.set(componentId, [welcomeMessage]);

        // Update state to trigger re-render
        setChatMessagesState(new Map(chatMessagesRef.current));
      }
    }, []);

    // Chat management functions
    const toggleChat = useCallback(
      (componentId: string) => {
        setChatState((prev) => {
          const newState = {
            isOpen: !prev.isOpen || prev.componentId !== componentId,
            componentId: prev.componentId === componentId ? null : componentId,
          };
          console.log(`Chat state changed:`, newState);

          // Add welcome message when opening chat for the first time
          if (newState.isOpen && newState.componentId === componentId) {
            addWelcomeMessage(componentId);
          }

          return newState;
        });
      },
      [addWelcomeMessage]
    );

    const addMessageToHistory = useCallback(
      (message: any) => {
        // Always add message to the current component's chat history
        const componentId = chatState.componentId;
        if (componentId) {
          const messages = chatMessagesRef.current.get(componentId) || [];
          chatMessagesRef.current.set(componentId, [...messages, message]);
          console.log(`Added message to ${componentId}:`, message.text);
        } else {
          console.warn("No component ID set for chat message");
        }
      },
      [chatState.componentId]
    );

    // Create a function that takes componentId as parameter
    const addMessageToComponent = useCallback(
      (componentId: string, message: any) => {
        if (componentId) {
          const messages = chatMessagesRef.current.get(componentId) || [];
          const newMessages = [...messages, message];
          chatMessagesRef.current.set(componentId, newMessages);

          // Update state to trigger re-render
          setChatMessagesState(new Map(chatMessagesRef.current));

          console.log(`Added message to ${componentId}:`, message.text);
        } else {
          console.warn("No component ID provided for chat message");
        }
      },
      []
    );

    const handleAddComponentToDashboard = useCallback(
      (newComponent: DraggableComponent) => {
        // Only modify the content of the current component, preserve chat state
        if (onUpdateComponent && chatState.componentId) {
          onUpdateComponent(chatState.componentId, {
            type: newComponent.type,
            title: newComponent.title,
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

    const onLayoutChange = useCallback((newLayout: LayoutItem[]) => {
      setLayout(newLayout);
      // Layout changes are automatically saved by the useEffect above
    }, []);

    const onResize = useCallback((layout: LayoutItem[]) => {
      setLayout(layout);
    }, []);

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
          onResize={onResize}
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
              messages={chatMessagesState.get(chatState.componentId) || []}
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
