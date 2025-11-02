// Custom React hooks for the Lobby Screen

import { useState, useEffect, useRef, useCallback } from 'react'
import { Player, ChatMessage, QuizSettings } from './types'
import { debounce, scrollToBottom, isAtBottom } from './utils'

/**
 * Hook for managing lobby state with mock real-time updates
 */
export const useLobbyState = (initialPlayers: Player[], roomCode: string) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    topic: 'Computer Science Fundamentals',
    difficulty: 'Medium',
    questionCount: 10,
    timePerQuestion: 30,
    allowHints: true,
    showCorrectAnswers: true
  })

  // Mock WebSocket connection simulation
  useEffect(() => {
    // Simulate random player ready status changes
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 5 seconds
        setPlayers(prev => prev.map(player => {
          if (!player.isHost && Math.random() > 0.7) {
            return { ...player, isReady: !player.isReady }
          }
          return player
        }))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const updatePlayerReady = useCallback((playerId: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId ? { ...player, isReady: !player.isReady } : player
    ))
  }, [])

  const kickPlayer = useCallback((playerId: string) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId))
  }, [])

  const addChatMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, newMessage])
  }, [])

  return {
    players,
    chatMessages,
    quizSettings,
    setQuizSettings,
    updatePlayerReady,
    kickPlayer,
    addChatMessage
  }
}

/**
 * Hook for managing countdown timer
 */
export const useCountdown = (initialTime: number = 10) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startCountdown = useCallback((duration?: number) => {
    if (duration) setTimeRemaining(duration)
    setIsActive(true)
    setIsComplete(false)
  }, [])

  const stopCountdown = useCallback(() => {
    setIsActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resetCountdown = useCallback((duration?: number) => {
    stopCountdown()
    setTimeRemaining(duration || initialTime)
    setIsComplete(false)
  }, [initialTime, stopCountdown])

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false)
            setIsComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeRemaining])

  return {
    timeRemaining,
    isActive,
    isComplete,
    startCountdown,
    stopCountdown,
    resetCountdown
  }
}

/**
 * Hook for managing chat auto-scroll
 */
export const useChatScroll = (messages: ChatMessage[]) => {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll && chatContainerRef.current) {
      scrollToBottom(chatContainerRef.current)
    }
  }, [messages, shouldAutoScroll])

  // Check if user manually scrolled up
  const handleScroll = useCallback(
    debounce(() => {
      if (chatContainerRef.current) {
        const atBottom = isAtBottom(chatContainerRef.current)
        setShouldAutoScroll(atBottom)
      }
    }, 100),
    []
  )

  return {
    chatContainerRef,
    shouldAutoScroll,
    handleScroll
  }
}

/**
 * Hook for managing modal states
 */
export const useModals = () => {
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)

  const openSettingsModal = useCallback(() => setShowSettingsModal(true), [])
  const closeSettingsModal = useCallback(() => setShowSettingsModal(false), [])

  const openRulesModal = useCallback(() => setShowRulesModal(true), [])
  const closeRulesModal = useCallback(() => setShowRulesModal(false), [])

  const openConfirmModal = useCallback((action: () => void) => {
    setConfirmAction(() => action)
    setShowConfirmModal(true)
  }, [])

  const closeConfirmModal = useCallback(() => {
    setShowConfirmModal(false)
    setConfirmAction(null)
  }, [])

  const executeConfirmAction = useCallback(() => {
    if (confirmAction) {
      confirmAction()
    }
    closeConfirmModal()
  }, [confirmAction, closeConfirmModal])

  return {
    showSettingsModal,
    showRulesModal,
    showConfirmModal,
    openSettingsModal,
    closeSettingsModal,
    openRulesModal,
    closeRulesModal,
    openConfirmModal,
    closeConfirmModal,
    executeConfirmAction
  }
}

/**
 * Hook for rotating fun facts
 */
export const useFunFacts = (facts: string[], interval: number = 5000) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  useEffect(() => {
    if (facts.length === 0) return

    const timer = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % facts.length)
    }, interval)

    return () => clearInterval(timer)
  }, [facts.length, interval])

  return {
    currentFact: facts[currentFactIndex] || '',
    currentFactIndex
  }
}

/**
 * Hook for managing clipboard operations with feedback
 */
export const useClipboard = () => {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, 2000)
      
      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      return false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { copied, copyToClipboard }
}

/**
 * Hook for managing practice quiz state
 */
export const usePracticeQuiz = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [hasAnswered, setHasAnswered] = useState(false)

  const selectAnswer = useCallback((answer: string) => {
    if (!hasAnswered) {
      setSelectedAnswer(answer)
    }
  }, [hasAnswered])

  const submitAnswer = useCallback(() => {
    if (selectedAnswer && !hasAnswered) {
      setHasAnswered(true)
      setShowResult(true)
    }
  }, [selectedAnswer, hasAnswered])

  const resetQuiz = useCallback(() => {
    setSelectedAnswer(null)
    setShowResult(false)
    setHasAnswered(false)
  }, [])

  return {
    selectedAnswer,
    showResult,
    hasAnswered,
    selectAnswer,
    submitAnswer,
    resetQuiz
  }
}