# Lobby Screen Requirements

## Introduction

The Lobby Screen is a multiplayer waiting area where players can join quiz rooms, interact with each other, and prepare for quiz sessions. The host can manage room settings and start quizzes when ready.

## Glossary

- **Host**: The player who created the quiz room and has administrative controls
- **Player**: Any user who has joined the quiz room
- **Room Code**: A unique identifier that allows players to join a specific quiz room
- **Ready Status**: Indicates whether a player is prepared to start the quiz
- **Quiz Session**: An active quiz game with questions and scoring

## Requirements

### Requirement 1

**User Story:** As a host, I want to create and manage a quiz room so that I can control the quiz experience for all participants.

#### Acceptance Criteria

1. WHEN the host creates a room, THE System SHALL generate a unique room code
2. WHEN the host views the lobby, THE System SHALL display host-only controls including "Start Quiz", "Kick Player", and "Edit Settings"
3. WHEN the host clicks "Edit Settings", THE System SHALL open a modal with quiz configuration options
4. WHEN the host clicks "Start Quiz", THE System SHALL initiate a countdown timer for all players
5. WHERE the host wants to remove a player, THE System SHALL provide a "Kick Player" function

### Requirement 2

**User Story:** As a player, I want to join a quiz room and see other participants so that I can prepare for the quiz with others.

#### Acceptance Criteria

1. WHEN a player joins using a room code, THE System SHALL add them to the player list
2. WHEN viewing the lobby, THE System SHALL display all joined players with avatars and usernames
3. WHEN a player toggles ready status, THE System SHALL update their status icon (✅ for ready, ⏳ for waiting)
4. WHEN viewing other players, THE System SHALL highlight the host with a distinctive visual indicator
5. THE System SHALL display the player's own ready status and allow them to toggle it

### Requirement 3

**User Story:** As a player, I want to easily share the room code so that I can invite friends to join the quiz.

#### Acceptance Criteria

1. THE System SHALL prominently display the room code in a dedicated card
2. WHEN a player clicks "Copy Code", THE System SHALL copy the room code to clipboard
3. WHEN a player clicks "Share Invite", THE System SHALL use Web Share API if available
4. IF Web Share API is unavailable, THE System SHALL fallback to copying a shareable link
5. THE System SHALL provide visual feedback when code is successfully copied

### Requirement 4

**User Story:** As a player, I want to see quiz information and practice before starting so that I can prepare effectively.

#### Acceptance Criteria

1. THE System SHALL display a quiz info card showing quiz name, question count, and difficulty
2. WHEN a player clicks "View Rules", THE System SHALL open a modal explaining quiz rules
3. THE System SHALL provide a mini practice section with one sample question
4. WHEN a player clicks "Try it" on practice question, THE System SHALL show multiple choice options
5. THE System SHALL clearly indicate that practice questions are non-scored

### Requirement 5

**User Story:** As a player, I want to communicate with other players while waiting so that the lobby experience is engaging.

#### Acceptance Criteria

1. THE System SHALL provide a chat box for text messages between players
2. THE System SHALL support emoji reactions for quick communication
3. WHEN new messages arrive, THE System SHALL auto-scroll to show latest content
4. THE System SHALL display sender names with each message
5. THE System SHALL limit message length to prevent spam

### Requirement 6

**User Story:** As a player, I want visual feedback and animations so that the lobby feels interactive and engaging.

#### Acceptance Criteria

1. WHEN the countdown starts, THE System SHALL display a circular progress indicator
2. WHILE countdown is active, THE System SHALL transition colors from green to yellow to red
3. WHEN players are ready, THE System SHALL animate their avatars with pulse or glow effects
4. WHEN countdown reaches zero, THE System SHALL trigger confetti or sparkle animation
5. THE System SHALL display rotating fun facts every few seconds at the bottom

### Requirement 7

**User Story:** As a player, I want to see performance history so that I can track improvement and compare with others.

#### Acceptance Criteria

1. THE System SHALL display a leaderboard snapshot showing top 3 players from previous rounds
2. WHEN no previous data exists, THE System SHALL show placeholder or motivational text
3. THE System SHALL update leaderboard data after each completed quiz
4. THE System SHALL display player scores and rankings clearly
5. THE System SHALL highlight the current player's position if in top 3

### Requirement 8

**User Story:** As a user on any device, I want the lobby to work seamlessly so that I can participate regardless of my device.

#### Acceptance Criteria

1. THE System SHALL provide responsive design for desktop, tablet, and mobile devices
2. WHEN screen size changes, THE System SHALL adapt layout without losing functionality
3. THE System SHALL ensure all interactive elements are touch-friendly on mobile
4. THE System SHALL maintain readability across all screen sizes
5. THE System SHALL optimize chat and player list for mobile viewing