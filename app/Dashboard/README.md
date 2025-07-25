# Dashboard Architecture

This document describes the refactored dashboard architecture with proper separation of concerns.

## Architecture Overview

The dashboard has been refactored to follow a clean architecture pattern where each component has a single responsibility:

### 1. Dashboard Component (`Dashboard.tsx`)
**Responsibility**: App bar, navbar, and master layout coordination
- Manages the overall dashboard layout
- Handles app bar with component counter
- Provides side navigation
- Coordinates with MasterLayout for component management
- Provides floating add button for new components

**Key Features**:
- Component state management
- Component addition/removal coordination
- Component update handling

### 2. MasterLayout Component (`MasterLayout.tsx`)
**Responsibility**: Grid layout management only
- Handles responsive grid layout using react-grid-layout
- Manages component positioning and sizing
- Calculates optimal positions for new components
- Provides layout change callbacks

**Key Features**:
- Grid layout management
- Component positioning algorithms
- Layout state management
- No chat or component-specific logic

### 3. ComponentWrapper Component (`ComponentWrapper.tsx`)
**Responsibility**: Component wrapping and individual component features
- Wraps individual components with app bar
- Manages component-specific chat state
- Handles component removal and updates
- Calculates chat positioning relative to component

**Key Features**:
- Individual component app bar
- Component-specific chat management
- Chat positioning logic
- Component update handling

### 4. AIChatComponent (`AIChatComponent.tsx`)
**Responsibility**: Chat functionality and state management
- Manages its own chat history
- Handles message processing and AI responses
- Provides component suggestions
- Can work with external or internal message state

**Key Features**:
- Self-contained chat state
- Message history management
- AI response processing
- Component suggestion system

## Data Flow

```
Dashboard
├── Manages component list
├── Coordinates with MasterLayout
└── Handles component lifecycle

MasterLayout
├── Manages grid layout
├── Positions components
└── Delegates rendering to ComponentWrapper

ComponentWrapper
├── Wraps individual components
├── Manages component-specific chat
├── Handles component updates
└── Preserves chat history on updates

AIChatComponent
├── Manages chat messages
├── Processes user input
├── Provides AI responses
└── Suggests components
```

## Key Benefits of Refactoring

### 1. Separation of Concerns
- Each component has a single, well-defined responsibility
- No mixing of layout, chat, and component logic
- Clear boundaries between different functionalities

### 2. Chat History Preservation
- Individual components manage their own chat state
- Chat history is preserved when components are updated
- No loss of conversation context during component modifications

### 3. Scalability
- Easy to add new component types
- Chat functionality is reusable across components
- Layout system is independent of component logic

### 4. Maintainability
- Clear component boundaries make debugging easier
- Changes to one component don't affect others
- Well-defined interfaces between components

## Component Update Flow

When a component is updated (e.g., through chat):

1. **AIChatComponent** processes user request
2. **ComponentWrapper** receives update callback
3. **ComponentWrapper** calls parent's `onUpdateComponent`
4. **Dashboard** updates component in its state
5. **MasterLayout** receives updated component
6. **ComponentWrapper** re-renders with new content
7. **Chat history is preserved** throughout the process

## Chat Architecture

### Individual Component Chats
- Each component has its own chat instance
- Chat state is managed independently
- No shared chat state between components
- Chat history persists across component updates

### Chat Positioning
- Chats are positioned relative to their parent component
- Automatic positioning to avoid screen edges
- Responsive to component location changes

### Message Management
- Messages can be managed internally or externally
- Support for both controlled and uncontrolled chat state
- Automatic welcome message initialization

## Usage Examples

### Adding a New Component
```typescript
// Dashboard handles component addition
const handleAddComponentToDashboard = (component: DraggableComponent) => {
  const newComponent = { ...component, id: generateUniqueId() };
  setDashboardComponents(prev => [...prev, newComponent]);
  masterLayoutRef.current?.addLayoutItem(newComponent);
};
```

### Updating a Component
```typescript
// ComponentWrapper handles component updates
const handleAddComponentToDashboard = (newComponent: DraggableComponent) => {
  onUpdateComponent(component.id, {
    type: newComponent.type,
    title: newComponent.title,
    content: newComponent.content,
    // Chat history is preserved
  });
};
```

### Managing Chat State
```typescript
// AIChatComponent manages its own state
const [internalMessages, setInternalMessages] = useState<Message[]>([]);
const messages = externalMessages || internalMessages;
```

## Future Enhancements

1. **Persistent Chat History**: Save chat history to localStorage or backend
2. **Component Templates**: Pre-defined component configurations
3. **Advanced Positioning**: More sophisticated chat positioning algorithms
4. **Real-time Collaboration**: Multi-user dashboard support
5. **Component Dependencies**: Components that can interact with each other 