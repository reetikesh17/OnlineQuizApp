// Mock data for development and testing of the Lobby Screen

import { Player, ChatMessage, QuizSettings, LeaderboardEntry, PracticeQuestion } from './types'

// Mock players for testing
export const mockPlayers: Player[] = [
  {
    id: '1',
    username: 'John Doe',
    avatar: '👨‍💻',
    isReady: true,
    isHost: true,
    isOnline: true
  },
  {
    id: '2', 
    username: 'Reetikesh',
    avatar: '🧑‍🎓',
    isReady: false,
    isHost: false,
    isOnline: true
  },
  {
    id: '3',
    username: 'Srijan',
    avatar: '👩‍🔬',
    isReady: true,
    isHost: false,
    isOnline: true
  },
  {
    id: '4',
    username: 'Alex Smith',
    avatar: '🧑‍🚀',
    isReady: false,
    isHost: false,
    isOnline: false
  }
]

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'John Doe',
    content: 'Welcome everyone! Ready for the quiz?',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    type: 'text'
  },
  {
    id: '2',
    senderId: '2',
    senderName: 'Reetikesh',
    content: '🎉',
    timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    type: 'emoji'
  },
  {
    id: '3',
    senderId: '3',
    senderName: 'Srijan',
    content: 'Looking forward to it! What topic are we doing?',
    timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    type: 'text'
  },
  {
    id: '4',
    senderId: '1',
    senderName: 'John Doe',
    content: 'Computer Science Fundamentals - should be fun!',
    timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    type: 'text'
  },
  {
    id: '5',
    senderId: '4',
    senderName: 'Alex Smith',
    content: 'Just joined! Give me a sec to get ready 👍',
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
    type: 'text'
  }
]

// Default quiz settings
export const defaultQuizSettings: QuizSettings = {
  topic: 'Computer Science Fundamentals',
  difficulty: 'Medium',
  questionCount: 10,
  timePerQuestion: 30,
  allowHints: true,
  showCorrectAnswers: true
}

// Mock leaderboard data
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    playerId: '3',
    playerName: 'Srijan',
    score: 95,
    rank: 1,
    avatar: '👩‍🔬'
  },
  {
    playerId: '1',
    playerName: 'John Doe',
    score: 87,
    rank: 2,
    avatar: '👨‍💻'
  },
  {
    playerId: '2',
    playerName: 'Reetikesh',
    score: 82,
    rank: 3,
    avatar: '🧑‍🎓'
  }
]

// Sample practice questions
export const mockPracticeQuestions: PracticeQuestion[] = [
  {
    id: 'practice-1',
    question: 'What does CPU stand for?',
    options: [
      'Central Processing Unit',
      'Computer Personal Unit', 
      'Core Processing Utility',
      'Central Program Unit'
    ],
    correctAnswer: 'Central Processing Unit',
    explanation: 'CPU stands for Central Processing Unit, which is the main component that executes instructions in a computer.'
  },
  {
    id: 'practice-2',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    correctAnswer: 'O(log n)',
    explanation: 'Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each step.'
  },
  {
    id: 'practice-3',
    question: 'Which data structure uses LIFO principle?',
    options: ['Queue', 'Array', 'Stack', 'Tree'],
    correctAnswer: 'Stack',
    explanation: 'Stack follows Last In, First Out (LIFO) principle where the last element added is the first one to be removed.'
  }
]

// Fun facts for the widget
export const funFacts: string[] = [
  "The first computer bug was an actual bug - a moth found in a Harvard computer in 1947! 🐛",
  "The term 'debugging' was coined by Admiral Grace Hopper when she found that moth! 🔍",
  "The first computer programmer was Ada Lovelace in the 1840s! 👩‍💻",
  "There are more possible games of chess than atoms in the observable universe! ♟️",
  "The first 1GB hard drive weighed over 500 pounds and cost $40,000! 💾",
  "Python was named after Monty Python's Flying Circus, not the snake! 🐍",
  "The '@' symbol was used in email for the first time in 1971! 📧",
  "The first website ever created is still online: info.cern.ch! 🌐",
  "JavaScript was created in just 10 days by Brendan Eich! ⚡",
  "The term 'Wi-Fi' doesn't actually stand for anything - it's just a made-up name! 📶"
]

// Available quiz topics (from CSV data)
export const availableTopics = [
  'Computer Science Fundamentals',
  'Physics', 
  'Biology',
  'Mechanical Engineering',
  'General Knowledge',
  'Programming',
  'Android Development',
  'Aptitude',
  'Movies',
  'Literature'
]

// Common emoji reactions for chat
export const commonEmojis = [
  '👍', '👎', '😀', '😂', '🤔', '😮', '🎉', '🔥', '💯', '❤️', '👏', '🚀'
]

// Generate a random room code
export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Get a random practice question
export const getRandomPracticeQuestion = (): PracticeQuestion => {
  return mockPracticeQuestions[Math.floor(Math.random() * mockPracticeQuestions.length)]
}

// Get a random fun fact
export const getRandomFunFact = (): string => {
  return funFacts[Math.floor(Math.random() * funFacts.length)]
}