# Lobby Screen Design Document

## Overview

The Lobby Screen is a comprehensive multiplayer waiting area that serves as the central hub for quiz room management and player interaction. It provides real-time updates, interactive elements, and a responsive design that works across all devices.

## Architecture

### Component Hierarchy
```
LobbyScreen
├── RoomHeader
│   ├── RoomCodeCard
│   └── QuizInfoCard
├── MainContent
│   ├── PlayerListPanel
│   ├── CenterSection
│   │   ├── CountdownTimer
│   │   ├── HostControls (conditional)
│   │   └── MiniPracticeQuiz
│   └── ChatBox
├── BottomSection
│   ├── LeaderboardSnapshot
│   └── FunFactWidget
└── Modals
    ├── SettingsModal
    ├── RulesModal
    └── ConfirmationModal
```

### State Management
- **Room State**: Room code, host ID, quiz settings, player count
- **Player State**: Player list, ready status, avatars, host designation
- **Chat State**: Messages, emoji reactions, auto-scroll position
- **UI State**: Modal visibility, countdown status, animations
- **Quiz State**: Current quiz info, practice questions, leaderboard data

## Components and Interfaces

### Core Components

#### LobbyScreen (Main Container)
```typescript
interface LobbyScreenProps {
  roomCode: string;
  currentUser: User;
  isHost: boolean;
}

interface LobbyState {
  players: Player[];
  chatMessages: ChatMessage[];
  quizSettings: QuizSettings;
  countdownActive: boolean;
  timeRemaining: number;
}
```

#### PlayerListPanel
```typescript
interface Player {
  id: string;
  username: string;
  avatar: string;
  isReady: boolean;
  isHost: boolean;
  isOnline: boolean;
}

interface PlayerListProps {
  players: Player[];
  currentUserId: string;
  onKickPlayer?: (playerId: string) => void;
  isHost: boolean;
}
```

#### ChatBox
```typescript
interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'system';
}

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onSendEmoji: (emoji: string) => void;
}
```

#### CountdownTimer
```typescript
interface CountdownProps {
  isActive: boolean;
  duration: number;
  onComplete: () => void;
  onCancel?: () => void;
}
```

#### HostControls
```typescript
interface HostControlsProps {
  onStartQuiz: () => void;
  onEditSettings: () => void;
  onKickPlayer: (playerId: string) => void;
  canStartQuiz: boolean;
  playerCount: number;
}
```

### Data Models

#### Quiz Settings
```typescript
interface QuizSettings {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  timePerQuestion: number;
  allowHints: boolean;
  showCorrectAnswers: boolean;
}
```

#### Room Configuration
```typescript
interface RoomConfig {
  code: string;
  hostId: string;
  maxPlayers: number;
  isPrivate: boolean;
  createdAt: Date;
  quizSettings: QuizSettings;
}
```

## Layout Design

### Desktop Layout (1200px+)
```
┌─────────────────────────────────────────────────────────────┐
│ Room Code Card          │         Quiz Info Card            │
├─────────────────────────┼───────────────────────────────────┤
│                         │                                   │
│    Player List          │      Countdown Timer              │
│    (Left Panel)         │      Host Controls                │
│                         │      Mini Practice                │
│                         │                                   │
├─────────────────────────┼───────────────────────────────────┤
│ Leaderboard Snapshot    │         Fun Fact Widget          │
└─────────────────────────┴───────────────────────────────────┘
│                    Chat Box (Right Side)                    │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (768px-)
```
┌─────────────────────────────────────┐
│         Room Code Card              │
├─────────────────────────────────────┤
│         Quiz Info Card              │
├─────────────────────────────────────┤
│       Countdown Timer               │
├─────────────────────────────────────┤
│       Host Controls                 │
├─────────────────────────────────────┤
│       Player List                   │
├─────────────────────────────────────┤
│       Mini Practice                 │
├─────────────────────────────────────┤
│       Chat Box                      │
├─────────────────────────────────────┤
│    Leaderboard & Fun Facts          │
└─────────────────────────────────────┘
```

## Visual Design Specifications

### Color Scheme
- **Primary**: Blue (#3B82F6) - Host controls, active states
- **Secondary**: Purple (#8B5CF6) - Accent elements, animations
- **Success**: Green (#10B981) - Ready status, positive actions
- **Warning**: Yellow (#F59E0B) - Countdown middle phase
- **Danger**: Red (#EF4444) - Countdown final phase, kick actions
- **Neutral**: Gray (#6B7280) - Text, borders, inactive states

### Typography
- **Headers**: Inter Bold, 24px-32px
- **Subheaders**: Inter Semibold, 18px-20px
- **Body**: Inter Regular, 14px-16px
- **Captions**: Inter Medium, 12px-14px

### Spacing System
- **Base Unit**: 4px
- **Small**: 8px (2 units)
- **Medium**: 16px (4 units)
- **Large**: 24px (6 units)
- **XLarge**: 32px (8 units)

### Animation Specifications
- **Pulse Effect**: 2s infinite ease-in-out for ready players
- **Countdown**: Smooth color transitions over 1s
- **Confetti**: 3s burst animation with physics
- **Hover States**: 0.2s ease-in-out transitions
- **Modal Animations**: 0.3s slide-in/fade effects

## Error Handling

### Connection Issues
- Display reconnection status
- Queue messages during disconnection
- Retry failed actions automatically
- Show offline players with visual indicator

### Validation Errors
- Real-time form validation for settings
- Clear error messages with suggested fixes
- Prevent invalid actions (e.g., start with no players)
- Graceful degradation for missing features

### Edge Cases
- Handle room capacity limits
- Manage duplicate usernames
- Deal with host disconnection (transfer host)
- Handle browser compatibility issues

## Testing Strategy

### Unit Tests
- Component rendering with various props
- State management and updates
- Event handler functionality
- Animation trigger conditions

### Integration Tests
- Real-time communication flow
- Modal interactions and state changes
- Responsive layout behavior
- Cross-browser compatibility

### User Experience Tests
- Accessibility compliance (WCAG 2.1)
- Performance on low-end devices
- Network interruption handling
- Multi-device synchronization

## Performance Considerations

### Optimization Strategies
- Lazy load non-critical components
- Debounce chat input and real-time updates
- Use React.memo for expensive re-renders
- Implement virtual scrolling for large player lists

### Bundle Size Management
- Code splitting for modals and advanced features
- Tree shaking for unused utilities
- Optimize images and animations
- Minimize third-party dependencies

### Real-time Updates
- Efficient WebSocket message handling
- Batch state updates to prevent excessive re-renders
- Use React Suspense for loading states
- Implement proper cleanup for subscriptions