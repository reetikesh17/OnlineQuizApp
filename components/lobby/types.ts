// Core TypeScript interfaces for the Lobby Screen system

export interface Player {
  id: string
  username: string
  avatar: string
  isReady: boolean
  isHost: boolean
  isOnline: boolean
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: 'text' | 'emoji' | 'system'
}

export interface QuizSettings {
  topic: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questionCount: number
  timePerQuestion: number
  allowHints: boolean
  showCorrectAnswers: boolean
  isCustomQuiz?: boolean
  customQuestions?: CustomQuestion[]
}

export interface CustomQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

export interface RoomConfig {
  code: string
  hostId: string
  maxPlayers: number
  isPrivate: boolean
  createdAt: Date
  quizSettings: QuizSettings
}

export interface LeaderboardEntry {
  playerId: string
  playerName: string
  score: number
  rank: number
  avatar: string
}

export interface PracticeQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

// Component Props Interfaces
export interface LobbyScreenProps {
  roomCode: string
  currentUser: Player
  isHost: boolean
}

export interface LobbyState {
  players: Player[]
  chatMessages: ChatMessage[]
  quizSettings: QuizSettings
  countdownActive: boolean
  timeRemaining: number
  showSettingsModal: boolean
  showRulesModal: boolean
  showConfirmModal: boolean
}

export interface PlayerListProps {
  players: Player[]
  currentUserId: string
  onKickPlayer?: (playerId: string) => void
  onToggleReady: (playerId: string) => void
  isHost: boolean
}

export interface ChatBoxProps {
  messages: ChatMessage[]
  onSendMessage: (content: string) => void
  onSendEmoji: (emoji: string) => void
  currentUserId: string
}

export interface CountdownProps {
  isActive: boolean
  duration: number
  onComplete: () => void
  onCancel?: () => void
}

export interface HostControlsProps {
  onStartQuiz: () => void
  onEditSettings: () => void
  onKickPlayer: (playerId: string) => void
  canStartQuiz: boolean
  playerCount: number
}

export interface RoomCodeCardProps {
  roomCode: string
  onCopyCode: () => void
  onShareInvite: () => void
}

export interface QuizInfoCardProps {
  quizSettings: QuizSettings
  onViewRules: () => void
}

export interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: QuizSettings) => void
  currentSettings: QuizSettings
}

export interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface CreateQuizModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (quiz: { title: string; questions: CustomQuestion[] }) => void
}

export interface LeaderboardSnapshotProps {
  leaderboard: LeaderboardEntry[]
  currentUserId: string
}

export interface MiniPracticeQuizProps {
  question: PracticeQuestion
  onAnswer: (answer: string) => void
}

export interface FunFactWidgetProps {
  facts: string[]
  rotationInterval?: number
}