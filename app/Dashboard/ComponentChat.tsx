import React, { useState, useRef, useEffect } from "react";
import type { DraggableComponent } from "./ComponentLibrary";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  suggestions?: string[];
}

interface ComponentChatProps {
  componentId: string;
  componentTitle: string;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateComponent?: (
    componentId: string,
    updates: Partial<DraggableComponent>
  ) => void;
}

const ComponentChat: React.FC<ComponentChatProps> = ({
  componentId,
  componentTitle,
  isOpen,
  onToggle,
  onUpdateComponent,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello! I'm here to help you modify the "${componentTitle}" component. You can ask me to change colors, content, size, or other properties. Try saying "change color to blue" or "make it bigger".`,
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Process user input and generate AI response
    setTimeout(() => {
      const response = processUserInput(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "ai",
        timestamp: new Date(),
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const processUserInput = (
    input: string
  ): { text: string; suggestions?: string[] } => {
    const lowerInput = input.toLowerCase();

    // Handle color changes
    if (lowerInput.includes("change color") || lowerInput.includes("make it")) {
      if (lowerInput.includes("blue")) {
        console.log("Updating component to blue theme:", componentId);
        onUpdateComponent?.(componentId, {
          content: (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#e3f2fd",
                borderRadius: "8px",
                height: "100%",
                border: "2px solid #1976d2",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  color: "#1976d2",
                  fontSize: "16px",
                }}
              >
                {componentTitle} (Blue Theme)
              </h3>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Component updated with blue color scheme!
              </div>
            </div>
          ),
        });
        return {
          text: "I've updated the component with a blue color scheme! The component now has a blue background and border.",
          suggestions: [
            "change color to green",
            "change color to purple",
            "make it bigger",
            "change title",
          ],
        };
      }
      if (lowerInput.includes("green")) {
        console.log("Updating component to green theme:", componentId);
        onUpdateComponent?.(componentId, {
          content: (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#e8f5e8",
                borderRadius: "8px",
                height: "100%",
                border: "2px solid #2e7d32",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  color: "#2e7d32",
                  fontSize: "16px",
                }}
              >
                {componentTitle} (Green Theme)
              </h3>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Component updated with green color scheme!
              </div>
            </div>
          ),
        });
        return {
          text: "I've updated the component with a green color scheme! The component now has a green background and border.",
          suggestions: [
            "change color to blue",
            "change color to purple",
            "make it bigger",
            "change title",
          ],
        };
      }
      if (lowerInput.includes("purple")) {
        console.log("Updating component to purple theme:", componentId);
        onUpdateComponent?.(componentId, {
          content: (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f3e5f5",
                borderRadius: "8px",
                height: "100%",
                border: "2px solid #7b1fa2",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  color: "#7b1fa2",
                  fontSize: "16px",
                }}
              >
                {componentTitle} (Purple Theme)
              </h3>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Component updated with purple color scheme!
              </div>
            </div>
          ),
        });
        return {
          text: "I've updated the component with a purple color scheme! The component now has a purple background and border.",
          suggestions: [
            "change color to blue",
            "change color to green",
            "make it bigger",
            "change title",
          ],
        };
      }
      if (lowerInput.includes("red")) {
        console.log("Updating component to red theme:", componentId);
        onUpdateComponent?.(componentId, {
          content: (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#ffebee",
                borderRadius: "8px",
                height: "100%",
                border: "2px solid #d32f2f",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  color: "#d32f2f",
                  fontSize: "16px",
                }}
              >
                {componentTitle} (Red Theme)
              </h3>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Component updated with red color scheme!
              </div>
            </div>
          ),
        });
        return {
          text: "I've updated the component with a red color scheme! The component now has a red background and border.",
          suggestions: [
            "change color to blue",
            "change color to green",
            "make it bigger",
            "change title",
          ],
        };
      }
    }

    // Handle size changes
    if (
      lowerInput.includes("make it bigger") ||
      lowerInput.includes("increase size") ||
      lowerInput.includes("larger")
    ) {
      console.log("Making component bigger:", componentId);
      onUpdateComponent?.(componentId, {
        size: { w: 6, h: 4 },
      });
      return {
        text: "I've made the component bigger! It's now 6x4 grid units.",
        suggestions: [
          "make it smaller",
          "change color to blue",
          "change title",
        ],
      };
    }

    if (
      lowerInput.includes("make it smaller") ||
      lowerInput.includes("decrease size") ||
      lowerInput.includes("smaller")
    ) {
      console.log("Making component smaller:", componentId);
      onUpdateComponent?.(componentId, {
        size: { w: 2, h: 2 },
      });
      return {
        text: "I've made the component smaller! It's now 2x2 grid units.",
        suggestions: ["make it bigger", "change color to blue", "change title"],
      };
    }

    // Handle content changes
    if (
      lowerInput.includes("change title") ||
      lowerInput.includes("update title")
    ) {
      const newTitle = extractNewTitle(input);
      if (newTitle) {
        onUpdateComponent?.(componentId, {
          title: newTitle,
          content: (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                height: "100%",
                border: "2px solid #dee2e6",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  color: "#333",
                  fontSize: "16px",
                }}
              >
                {newTitle}
              </h3>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Title updated successfully!
              </div>
            </div>
          ),
        });
        return {
          text: `I've updated the title to "${newTitle}"!`,
          suggestions: [
            "change color to blue",
            "make it bigger",
            "change content",
          ],
        };
      }
    }

    // Handle content changes
    if (
      lowerInput.includes("change content") ||
      lowerInput.includes("update content") ||
      lowerInput.includes("modify content")
    ) {
      const newContent = extractNewContent(input);
      if (newContent) {
        onUpdateComponent?.(componentId, {
          content: (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                height: "100%",
                border: "2px solid #dee2e6",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  color: "#333",
                  fontSize: "16px",
                }}
              >
                {componentTitle}
              </h3>
              <div style={{ fontSize: "14px", color: "#666" }}>
                {newContent}
              </div>
            </div>
          ),
        });
        return {
          text: `I've updated the content to: "${newContent}"`,
          suggestions: [
            "change color to blue",
            "make it bigger",
            "change title",
          ],
        };
      }
    }

    // Handle help requests
    if (lowerInput.includes("help") || lowerInput.includes("what can you do")) {
      return {
        text: `I can help you modify this component! Here's what I can do:
• Change colors: "change color to blue/green/purple/red"
• Change size: "make it bigger/smaller"
• Change title: "change title to [new title]"
• Change content: "change content to [new content]"
• Get help: "help" or "what can you do"

Try saying "change color to blue" or "make it bigger"!`,
        suggestions: [
          "change color to blue",
          "make it bigger",
          "change title",
          "help",
        ],
      };
    }

    console.log("No action matched for input:", input);
    return {
      text: `I received your message: "${input}". You can ask me to "change color to blue/green/purple/red", "make it bigger/smaller", "change title to [new title]", or "change content to [new content]" to modify this component.`,
      suggestions: [
        "change color to blue",
        "make it bigger",
        "change title",
        "help",
      ],
    };
  };

  const extractNewTitle = (input: string): string | null => {
    const match =
      input.match(/change title to (.+)/i) ||
      input.match(/update title to (.+)/i);
    return match ? match[1].trim() : null;
  };

  const extractNewContent = (input: string): string | null => {
    const match =
      input.match(/change content to (.+)/i) ||
      input.match(/update content to (.+)/i) ||
      input.match(/modify content to (.+)/i);
    return match ? match[1].trim() : null;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const styles = {
    chatContainer: {
      position: "absolute" as const,
      bottom: "0",
      right: "0",
      width: "280px",
      height: "350px",
      border: "1px solid #ccc",
      backgroundColor: "#f8f8f8",
      zIndex: 1000,
      display: isOpen ? "flex" : "none",
      flexDirection: "column" as const,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 12px",
      backgroundColor: "#f0f0f0",
      color: "#333",
      borderBottom: "1px solid #ccc",
      fontSize: "12px",
    },
    headerTitle: {
      margin: 0,
      fontSize: "12px",
      fontWeight: "600",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#333",
      cursor: "pointer",
      padding: "2px",
      fontSize: "10px",
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
      padding: "8px",
      backgroundColor: "#f8f8f8",
      fontSize: "11px",
    },
    message: {
      marginBottom: "8px",
      display: "flex",
      flexDirection: "column" as const,
    },
    userMessage: {
      alignItems: "flex-end",
    },
    aiMessage: {
      alignItems: "flex-start",
    },
    messageBubble: {
      maxWidth: "80%",
      padding: "6px 8px",
      borderRadius: "4px",
      wordWrap: "break-word" as const,
      fontSize: "10px",
    },
    userBubble: {
      backgroundColor: "#007bff",
      color: "white",
    },
    aiBubble: {
      backgroundColor: "white",
      color: "#333",
      border: "1px solid #ccc",
    },
    messageTime: {
      fontSize: "9px",
      color: "#666",
      marginTop: "2px",
    },
    suggestionsContainer: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "4px",
      marginTop: "4px",
    },
    suggestionButton: {
      background: "#e3f2fd",
      border: "1px solid #007bff",
      borderRadius: "12px",
      padding: "2px 6px",
      fontSize: "8px",
      cursor: "pointer",
      color: "#007bff",
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
      padding: "4px 8px",
      fontSize: "10px",
      outline: "none",
    },
    sendButton: {
      marginLeft: "4px",
      padding: "4px 8px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "10px",
    },
    loadingIndicator: {
      display: "flex",
      alignItems: "center",
      gap: "2px",
      color: "#666",
      fontSize: "9px",
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
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <div style={styles.header}>
        <h4 style={styles.headerTitle}>Chat: {componentTitle}</h4>
        <button style={styles.closeButton} onClick={onToggle}>
          ×
        </button>
      </div>
      <div style={styles.content}>
        <div style={styles.messagesContainer}>
          {messages.map((message) => (
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
              {message.suggestions && (
                <div style={styles.suggestionsContainer}>
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      style={styles.suggestionButton}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <div style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
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
            placeholder="Modify this component..."
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

export default ComponentChat;
