// Utility functions for the Lobby Screen

import { Player, ChatMessage } from './types'

/**
 * Copy text to clipboard with fallback for older browsers
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const success = document.execCommand('copy')
      textArea.remove()
      return success
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Share content using Web Share API with fallback
 */
export const shareInvite = async (roomCode: string, appUrl: string = window.location.origin): Promise<boolean> => {
  const shareData = {
    title: 'Join my QuizMaster room!',
    text: `Join my quiz room with code: ${roomCode}`,
    url: `${appUrl}?room=${roomCode}`
  }

  try {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData)
      return true
    } else {
      // Fallback to copying the invite link
      const inviteText = `Join my QuizMaster quiz! Room code: ${roomCode}\n${shareData.url}`
      return await copyToClipboard(inviteText)
    }
  } catch (error) {
    console.error('Failed to share:', error)
    // Fallback to copying
    const inviteText = `Join my QuizMaster quiz! Room code: ${roomCode}\n${shareData.url}`
    return await copyToClipboard(inviteText)
  }
}

/**
 * Format timestamp for chat messages
 */
export const formatMessageTime = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now'
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }
  
  // More than 24 hours - show date
  return timestamp.toLocaleDateString()
}

/**
 * Validate room code format
 */
export const isValidRoomCode = (code: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(code)
}

/**
 * Get ready player count
 */
export const getReadyPlayerCount = (players: Player[]): number => {
  return players.filter(player => player.isReady).length
}

/**
 * Get online player count
 */
export const getOnlinePlayerCount = (players: Player[]): number => {
  return players.filter(player => player.isOnline).length
}

/**
 * Check if all players are ready
 */
export const areAllPlayersReady = (players: Player[]): boolean => {
  const onlinePlayers = players.filter(player => player.isOnline)
  return onlinePlayers.length > 0 && onlinePlayers.every(player => player.isReady)
}

/**
 * Generate avatar from username if no avatar provided
 */
export const generateAvatar = (username: string): string => {
  const avatars = ['👨‍💻', '👩‍💻', '🧑‍🎓', '👩‍🎓', '🧑‍🔬', '👩‍🔬', '🧑‍🚀', '👩‍🚀', '🧑‍🎨', '👩‍🎨']
  const index = username.length % avatars.length
  return avatars[index]
}

/**
 * Sanitize chat message content
 */
export const sanitizeMessage = (content: string): string => {
  return content
    .trim()
    .slice(0, 200) // Limit message length
    .replace(/[<>]/g, '') // Remove potential HTML tags
}

/**
 * Generate unique message ID
 */
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format countdown time display
 */
export const formatCountdownTime = (seconds: number): string => {
  if (seconds <= 0) return '0:00'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Get countdown color based on remaining time
 */
export const getCountdownColor = (timeRemaining: number, totalTime: number): string => {
  const percentage = timeRemaining / totalTime
  
  if (percentage > 0.6) return '#10B981' // Green
  if (percentage > 0.3) return '#F59E0B' // Yellow
  return '#EF4444' // Red
}

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Scroll to bottom of chat container
 */
export const scrollToBottom = (element: HTMLElement | null): void => {
  if (element) {
    element.scrollTop = element.scrollHeight
  }
}

/**
 * Check if user is at bottom of chat (for auto-scroll logic)
 */
export const isAtBottom = (element: HTMLElement | null, threshold: number = 100): boolean => {
  if (!element) return true
  
  const { scrollTop, scrollHeight, clientHeight } = element
  return scrollHeight - scrollTop - clientHeight < threshold
}