"use client"

import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { LobbyScreenProps } from './types'
import { mockPlayers, mockChatMessages, defaultQuizSettings, generateRoomCode, getRandomPracticeQuestion } from './mockData'
import { useLobbyState, useCountdown, useModals } from './hooks'

// Import components
import PlayerListPanel from './components/PlayerListPanel'
import ChatBox from './components/ChatBox'
import CountdownTimer from './components/CountdownTimer'
import HostControls from './components/HostControls'
import RoomCodeCard from './components/RoomCodeCard'
import QuizInfoCard from './components/QuizInfoCard'
import LeaderboardSnapshot from './components/LeaderboardSnapshot'
import MiniPracticeQuiz from './components/MiniPracticeQuiz'
import FunFactWidget from './components/FunFactWidget'
import SettingsModal from './components/SettingsModal'
import RulesModal from './components/RulesModal'
import CreateQuizModal from './components/CreateQuizModal'

interface LobbyScreenMainProps extends LobbyScreenProps {
  onBackToLobby: () => void
  onStartQuiz: (customQuiz?: any) => void
}

const LobbyScreen: React.FC<LobbyScreenMainProps> = ({
  roomCode: initialRoomCode,
  currentUser,
  isHost,
  onBackToLobby,
  onStartQuiz
}) => {
  // Generate room code if not provided
  const [roomCode] = useState(initialRoomCode || generateRoomCode())
  
  // Initialize lobby state with mock data
  const {
    players,
    chatMessages,
    quizSettings,
    setQuizSettings,
    updatePlayerReady,
    kickPlayer,
    addChatMessage
  } = useLobbyState(mockPlayers, roomCode)

  // Countdown timer state
  const {
    timeRemaining,
    isActive: countdownActive,
    isComplete: countdownComplete,
    startCountdown,
    stopCountdown,
    resetCountdown
  } = useCountdown(10)

  // Modal management
  const {
    showSettingsModal,
    showRulesModal,
    openSettingsModal,
    closeSettingsModal,
    openRulesModal,
    closeRulesModal
  } = useModals()

  // Create Quiz Modal state
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false)

  // Handle countdown completion
  useEffect(() => {
    if (countdownComplete) {
      // If it's a custom quiz, pass the quiz data
      if (quizSettings.isCustomQuiz && quizSettings.customQuestions) {
        const customQuiz = {
          id: 'custom-' + Date.now(),
          title: quizSettings.topic,
          description: `Custom quiz: ${quizSettings.topic}`,
          duration: quizSettings.questionCount * quizSettings.timePerQuestion,
          category: 'Custom',
          questions: quizSettings.customQuestions.map(q => ({
            id: q.id,
            type: 'radio' as const,
            question: q.question,
            options: q.options.filter(opt => opt && opt.trim()),
            correctAnswer: q.correctAnswer
          }))
        }
        onStartQuiz(customQuiz)
      } else {
        onStartQuiz()
      }
    }
  }, [countdownComplete, onStartQuiz, quizSettings])

  // Host control handlers
  const handleStartQuiz = () => {
    startCountdown(10) // 10 second countdown
  }

  const handleEditSettings = () => {
    openSettingsModal()
  }

  const handleKickPlayer = (playerId: string) => {
    kickPlayer(playerId)
  }

  const handleSaveSettings = (newSettings: typeof quizSettings) => {
    setQuizSettings(newSettings)
    closeSettingsModal()
  }

  const handleCreateQuiz = (customQuiz: { title: string; questions: any[] }) => {
    // Update quiz settings to use custom quiz
    setQuizSettings({
      ...quizSettings,
      topic: customQuiz.title,
      isCustomQuiz: true,
      customQuestions: customQuiz.questions,
      questionCount: customQuiz.questions.length
    })
    setShowCreateQuizModal(false)
  }

  const handleSendMessage = (content: string) => {
    addChatMessage({
      senderId: currentUser.id,
      senderName: currentUser.username,
      content,
      type: 'text'
    })
  }

  const handleSendEmoji = (emoji: string) => {
    addChatMessage({
      senderId: currentUser.id,
      senderName: currentUser.username,
      content: emoji,
      type: 'emoji'
    })
  }

  const canStartQuiz = players.filter(p => p.isOnline).length >= 2 && 
                     players.filter(p => p.isOnline && p.isReady).length >= 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBackToLobby}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Quiz Lobby</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Room header - Desktop: side by side, Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RoomCodeCard 
            roomCode={roomCode}
            onCopyCode={() => {}}
            onShareInvite={() => {}}
          />
          <QuizInfoCard 
            quizSettings={quizSettings}
            onViewRules={openRulesModal}
          />
        </div>

        {/* Main layout - Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Left panel - Player list */}
          <div className="lg:col-span-1">
            <PlayerListPanel
              players={players}
              currentUserId={currentUser.id}
              onKickPlayer={isHost ? handleKickPlayer : undefined}
              onToggleReady={updatePlayerReady}
              isHost={isHost}
            />
          </div>

          {/* Center section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Countdown timer */}
            {countdownActive && (
              <div className="flex justify-center">
                <CountdownTimer
                  isActive={countdownActive}
                  duration={10}
                  onComplete={() => {}}
                  onCancel={isHost ? stopCountdown : undefined}
                />
              </div>
            )}

            {/* Host controls */}
            {isHost && (
              <HostControls
                onStartQuiz={handleStartQuiz}
                onEditSettings={handleEditSettings}
                onKickPlayer={handleKickPlayer}
                onCreateQuiz={() => setShowCreateQuizModal(true)}
                canStartQuiz={canStartQuiz}
                playerCount={players.filter(p => p.isOnline).length}
              />
            )}

            {/* Mini practice quiz */}
            <MiniPracticeQuiz 
              question={getRandomPracticeQuestion()}
              onAnswer={() => {}}
            />
          </div>

          {/* Right panel - Chat */}
          <div className="lg:col-span-1">
            <ChatBox
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onSendEmoji={handleSendEmoji}
              currentUserId={currentUser.id}
            />
          </div>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaderboardSnapshot 
            leaderboard={[]}
            currentUserId={currentUser.id}
          />
          <FunFactWidget 
            facts={[]}
          />
        </div>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={closeSettingsModal}
        onSave={handleSaveSettings}
        currentSettings={quizSettings}
      />

      <RulesModal
        isOpen={showRulesModal}
        onClose={closeRulesModal}
      />

      <CreateQuizModal
        isOpen={showCreateQuizModal}
        onClose={() => setShowCreateQuizModal(false)}
        onSave={handleCreateQuiz}
      />
    </div>
  )
}

export default LobbyScreen