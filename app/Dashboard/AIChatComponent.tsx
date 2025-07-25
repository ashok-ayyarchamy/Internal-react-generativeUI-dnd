import React, { useState, useRef, useEffect } from "react";
import type { DraggableComponent } from "./ComponentLibrary";
import { componentLibrary } from "./ComponentLibrary";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  component?: DraggableComponent;
  suggestions?: any[]; // Use any[] to handle both string[] and DraggableComponent[]
}

interface AIChatComponentProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onAddComponentToDashboard?: (component: DraggableComponent) => void;
  messages?: Message[];
  onAddMessage?: (message: Message) => void;
}

const AIChatComponent: React.FC<AIChatComponentProps> = ({
  isMinimized,
  onToggleMinimize,
  onAddComponentToDashboard,
  messages = [],
  onAddMessage,
}) => {
  // Initialize with welcome message if no messages exist
  const initialMessages: Message[] =
    messages.length === 0
      ? [
          {
            id: "1",
            text: "Hello! I'm your AI assistant. I can help you add components to your dashboard. Try saying 'add chart', 'show components', or 'I need a data table'.",
            sender: "ai",
            timestamp: new Date(),
          },
        ]
      : messages;
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showComponentPanel, setShowComponentPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [initialMessages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    onAddMessage?.(userMessage);
    setInputText("");
    setIsLoading(true);

    setTimeout(() => {
      const response = processUserInput(inputText);
      if (response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: "ai",
          timestamp: new Date(),
          ...("component" in response && { component: response.component }),
          ...("suggestions" in response && {
            suggestions: response.suggestions,
          }),
        };
        onAddMessage?.(aiMessage);
      }
      setIsLoading(false);
    }, 1000);
  };

  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    const addComponent = (type: string, message: string) => {
      const component = componentLibrary.find((c) => c.type === type);
      if (component && onAddComponentToDashboard) {
        onAddComponentToDashboard(component);
        return { text: message, component };
      }
    };

    if (
      lowerInput.includes("add") ||
      lowerInput.includes("show") ||
      lowerInput.includes("need")
    ) {
      if (lowerInput.includes("chart") || lowerInput.includes("analytics")) {
        return addComponent(
          "chart",
          "I've added the Analytics Chart to your dashboard!"
        );
      }
      if (lowerInput.includes("table") || lowerInput.includes("data table")) {
        return addComponent(
          "table",
          "I've added the Data Table to your dashboard!"
        );
      }
      if (lowerInput.includes("card") || lowerInput.includes("info")) {
        return addComponent(
          "card",
          "I've added the Info Card to your dashboard!"
        );
      }
      if (lowerInput.includes("metric") || lowerInput.includes("key metric")) {
        return addComponent(
          "metric",
          "I've added the Key Metric to your dashboard!"
        );
      }
      if (lowerInput.includes("gauge") || lowerInput.includes("performance")) {
        return addComponent(
          "gauge",
          "I've added the Performance Gauge to your dashboard!"
        );
      }
      if (lowerInput.includes("list") || lowerInput.includes("activity")) {
        return addComponent(
          "list",
          "I've added the Activity List to your dashboard!"
        );
      }
      if (
        lowerInput.includes("component") ||
        lowerInput.includes("what") ||
        lowerInput.includes("available")
      ) {
        setShowComponentPanel(true);
        return {
          text: "Here are the available components you can add to your dashboard.",
          suggestions: componentLibrary,
        };
      }
      return {
        text: "I can help you add various components to your dashboard.",
        suggestions: componentLibrary,
      };
    }

    if (lowerInput.includes("help") || lowerInput.includes("what can you do")) {
      return {
        text: "I can help you manage your dashboard! Try saying 'add chart' or 'show components'.",
      };
    }

    return {
      text: `I received your message: "${input}". You can ask me to add specific components or say 'show components'.`,
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddComponent = (component: DraggableComponent) => {
    if (onAddComponentToDashboard) {
      onAddComponentToDashboard(component);
      onAddMessage?.({
        id: Date.now().toString(),
        text: `Added ${component.title} to dashboard`,
        sender: "ai",
        timestamp: new Date(),
      });
      setShowComponentPanel(false);
    }
  };

  const styles = {
    chatContainer: {
      display: "flex",
      flexDirection: "column" as const,
      height: isMinimized ? "50px" : "350px",
      border: "1px solid #ccc",
      backgroundColor: "white",
      width: "300px",
    },
    header: {
      height: "32px",
      backgroundColor: "#f5f5f5",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 8px",
      fontSize: "12px",
      color: "#666",
    },
    headerTitle: { margin: 0, fontSize: "12px", fontWeight: "500" },
    headerActions: { display: "flex", gap: "4px" },
    actionButton: {
      background: "transparent",
      border: "none",
      fontSize: "12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
      borderRadius: "4px",
    },
    content: {
      display: "flex",
      flexDirection: "column" as const,
      flex: 1,
      overflow: "hidden",
    },
    messagesContainer: {
      flex: 1,
      overflowY: "auto" as const,
      padding: "12px",
      backgroundColor: "#f8f8f8",
    },
    message: {
      marginBottom: "8px",
      display: "flex",
      flexDirection: "column" as const,
    },
    userMessage: { alignItems: "flex-end" },
    aiMessage: { alignItems: "flex-start" },
    messageBubble: {
      maxWidth: "80%",
      padding: "6px 8px",
      borderRadius: "4px",
      wordWrap: "break-word" as const,
      fontSize: "12px",
    },
    userBubble: { backgroundColor: "#666", color: "white" },
    aiBubble: {
      backgroundColor: "white",
      color: "#333",
      border: "1px solid #ccc",
    },
    messageTime: { fontSize: "10px", color: "#666", marginTop: "2px" },
    componentPanel: {
      backgroundColor: "white",
      border: "1px solid #ccc",
      borderRadius: "4px",
      marginTop: "4px",
      padding: "8px",
    },
    componentGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "4px",
      marginTop: "4px",
    },
    componentCard: {
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "6px",
      cursor: "pointer",
      backgroundColor: "#f8f8f8",
      fontSize: "11px",
      textAlign: "center" as const,
      minHeight: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputContainer: {
      display: "flex",
      padding: "8px",
      borderTop: "1px solid #ccc",
      backgroundColor: "white",
    },
    input: {
      flex: 1,
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "6px 8px",
      fontSize: "12px",
      outline: "none",
    },
    sendButton: {
      marginLeft: "4px",
      padding: "6px 12px",
      backgroundColor: "#666",
      color: "white",
      border: "none",
      fontSize: "12px",
    },
    loadingIndicator: {
      display: "flex",
      alignItems: "center",
      gap: "2px",
      color: "#666",
      fontSize: "10px",
    },
    dot: {
      width: "3px",
      height: "3px",
      backgroundColor: "#666",
      borderRadius: "50%",
      animation: "pulse 1.5s infinite",
    },
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header} onClick={onToggleMinimize}>
        <h3 style={styles.headerTitle}>AI Assistant</h3>
        <div style={styles.headerActions}>
          <button
            style={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggleMinimize();
            }}
          >
            {isMinimized ? "□" : "−"}
          </button>
        </div>
      </div>
      <div style={styles.content}>
        <div style={styles.messagesContainer}>
          {initialMessages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.message,
                ...(message.sender === "user"
                  ? styles.userMessage
                  : styles.aiMessage),
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  ...(message.sender === "user"
                    ? styles.userBubble
                    : styles.aiBubble),
                }}
              >
                {message.text}
              </div>
              {message.component && (
                <div style={styles.componentPanel}>
                  <div
                    style={{
                      fontSize: "12px",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Component Preview:
                  </div>
                  <div
                    style={{
                      transform: "scale(0.8)",
                      transformOrigin: "top left",
                    }}
                  >
                    {message.component.content}
                  </div>
                </div>
              )}
              {message.suggestions && (
                <div style={styles.componentPanel}>
                  <div
                    style={{
                      fontSize: "12px",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Available Components:
                  </div>
                  <div style={styles.componentGrid}>
                    {message.suggestions.map((component) => (
                      <div
                        key={component.id}
                        style={styles.componentCard}
                        onClick={() => handleAddComponent(component)}
                      >
                        {component.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          {showComponentPanel && (
            <div style={styles.message}>
              <div style={styles.aiMessage}>
                <div style={styles.aiBubble}>
                  <div style={styles.componentPanel}>
                    <div
                      style={{
                        fontSize: "12px",
                        marginBottom: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      Available Components:
                    </div>
                    <div style={styles.componentGrid}>
                      {componentLibrary.map((component) => (
                        <div
                          key={component.id}
                          style={styles.componentCard}
                          onClick={() => handleAddComponent(component)}
                        >
                          {component.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isLoading && (
            <div style={styles.message}>
              <div style={styles.aiMessage}>
                <div style={styles.aiBubble}>
                  <div style={styles.loadingIndicator}>
                    AI is typing
                    <div style={styles.dot}></div>
                    <div style={styles.dot}></div>
                    <div style={styles.dot}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (try 'add chart', 'show components', or 'help')"
            style={styles.input}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            style={{
              ...styles.sendButton,
              opacity: !inputText.trim() || isLoading ? 0.5 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatComponent;
