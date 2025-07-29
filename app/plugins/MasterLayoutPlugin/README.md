# DynoChatLayout Plugin

A comprehensive layout management system that provides drag-and-drop grid layouts, component persistence, chat integration, and responsive design.

## Features

- **Drag & Drop Grid Layout**: Powered by react-grid-layout
- **Component Persistence**: Automatic saving/loading of layout state
- **Chat Integration**: AI-powered chat for component management
- **Responsive Design**: Adapts to different screen sizes
- **State Management**: Custom hooks for clean state management
- **TypeScript Support**: Full type safety and IntelliSense

## Architecture

```
MasterLayoutPlugin/
├── components/
│   └── MasterLayout.tsx          # Main layout component (DynoChatLayout)
├── hooks/
│   ├── useLayoutState.ts         # Layout state management
│   ├── useChatManagement.ts      # Chat functionality
│   └── useContainerManagement.ts # Container dimensions
├── interfaces/
│   └── index.ts                  # TypeScript interfaces
├── utils/
│   ├── storage.ts                # LocalStorage utilities
│   └── layout.ts                 # Layout calculations
└── index.ts                      # Plugin exports
```

## Usage

### Basic Usage

```tsx
import { DynoChatLayout } from './plugins/MasterLayoutPlugin';

function Dashboard() {
  const [layoutInfo, setLayoutInfo] = useState({ layout: [], components: [] });

  return (
    <DynoChatLayout
      storageKey="my-dashboard-layout" // Enables persistence
      onLayoutChange={(layoutDetails) => {
        setLayoutInfo(layoutDetails);
      }}
      onAddNewComponent={(componentDetails) => {
        // Handle new component added
      }}
      onComponentUpdate={(updateDetails) => {
        // Handle component update
      }}
    />
  );
}
```

### Advanced Usage with Custom Configuration

```tsx
import { 
  DynoChatLayout, 
  useLayoutState, 
  useChatManagement 
} from './plugins/MasterLayoutPlugin';

function CustomDashboard() {
  const [layoutInfo, setLayoutInfo] = useState({ layout: [], components: [] });

  return (
    <DynoChatLayout
      // No storageKey = no persistence (default behavior)
      onLayoutChange={(layoutDetails) => {
        setLayoutInfo(layoutDetails);
      }}
      onAddNewComponent={(componentDetails) => {
        // Handle new component added
      }}
      onComponentUpdate={(updateDetails) => {
        // Handle component update
      }}
    />
  );
}
```

## API Reference

### DynoChatLayout Component

#### Props

- `storageKey?`: Optional storage key for persistence. If provided, layout state will be saved/loaded from localStorage. If not provided, no persistence will occur.
- `onLayoutChange`: Callback when layout changes, returns layout and components
- `onAddNewComponent`: Callback when new component is added, returns component details
- `onComponentUpdate`: Callback when component is updated, returns update details


#### Ref Methods

- `addLayoutItem(component)`: Add a new component to the layout
- `removeLayoutItem(id)`: Remove a component from the layout

### Hooks

#### useLayoutState

Manages layout state, persistence, and component lifecycle.

```tsx
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
```

#### useChatManagement

Manages chat functionality and AI interactions.

```tsx
const {
  toggleChat,
  handleAddComponentToDashboard,
  addMessageToHistory,
  addWelcomeMessage,
} = useChatManagement(
  chatState,
  updateChatState,
  addMessageToComponent,
  onAddComponentToDashboard
);
```

#### useContainerManagement

Manages container dimensions and responsiveness.

```tsx
const {
  containerWidth,
  containerHeight,
  containerRef,
} = useContainerManagement(layout);
```

### Utilities

#### Storage Utilities

- `saveLayoutState()`: Save layout to localStorage
- `loadLayoutState()`: Load layout from localStorage
- `clearAllPluginData()`: Clear all plugin data

#### Layout Utilities

- `calculateOptimalPosition()`: Calculate best position for new component
- `calculateOptimalSize()`: Calculate optimal size for component
- `calculateContainerHeight()`: Calculate dynamic container height
- `calculateChatPosition()`: Calculate chat popup position

## Interfaces

### DraggableComponent

```tsx
interface DraggableComponent {
  id: string;
  type: string;
  title: string;
  content: ReactNode;
}
```

### LayoutItem

```tsx
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
```

### ChatState

```tsx
interface ChatState {
  isOpen: boolean;
  componentId: string | null;
}
```

## Configuration

The plugin supports various configuration options:

```tsx
const DEFAULT_PLUGIN_CONFIG = {
  enableChat: true,
  enablePersistence: true,
  defaultGridCols: 12,
  defaultRowHeight: 40,
  containerPadding: [8, 8],
  margin: [8, 8],
};
```

## Dependencies

- `react-grid-layout`: For drag-and-drop grid functionality
- `react`: Core React library
- `typescript`: For type safety

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Considerations

- Uses React.memo for optimized re-renders
- Implements proper cleanup in useEffect hooks
- Efficient localStorage operations with error handling
- Debounced resize event handling

## Error Handling

The plugin includes comprehensive error handling:

- localStorage operations are wrapped in try-catch blocks
- Graceful fallbacks for missing data
- Console warnings for missing callbacks
- Type safety with TypeScript

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include JSDoc comments
4. Write unit tests for new features
5. Update this README for new features

## License

MIT License - see LICENSE file for details 