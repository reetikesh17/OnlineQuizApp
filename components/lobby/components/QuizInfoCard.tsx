"use client"

import React from 'react'
import { BookOpen, Clock, Hash, Target, HelpCircle, Award } from 'lucide-react'
import { QuizInfoCardProps } from '../types'

const QuizInfoCard: React.FC<QuizInfoCardProps> = ({
  quizSettings,
  onViewRules
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const estimatedDuration = Math.ceil((quizSettings.questionCount * quizSettings.timePerQuestion) / 60)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Quiz Information</h3>
            <p className="text-sm text-gray-500">Get ready for the challenge!</p>
          </div>
        </div>
        <button
          onClick={onViewRules}
          className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm"
        >
          <HelpCircle className="w-4 h-4" />
          <span>View Rules</span>
        </button>
      </div>

      {/* Quiz Topic */}
      <div className="mb-4">
        <h4 className="text-xl font-bold text-gray-800 mb-2">{quizSettings.topic}</h4>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quizSettings.difficulty)}`}>
            {quizSettings.difficulty}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Award className="w-4 h-4" />
            <span>Competitive</span>
          </div>
        </div>
      </div>

      {/* Quiz Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Questions</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{quizSettings.questionCount}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Per Question</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{quizSettings.timePerQuestion}s</div>
        </div>
      </div>

      {/* Estimated Duration */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Estimated Duration</span>
          </div>
          <span className="text-lg font-bold text-blue-800">{estimatedDuration} min</span>
        </div>
      </div>

      {/* Quiz Features */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Quiz Features:</h5>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${quizSettings.allowHints ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={`text-sm ${quizSettings.allowHints ? 'text-gray-700' : 'text-gray-400'}`}>
              Hints Available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${quizSettings.showCorrectAnswers ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={`text-sm ${quizSettings.showCorrectAnswers ? 'text-gray-700' : 'text-gray-400'}`}>
              Show Correct Answers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Real-time Scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Leaderboard</span>
          </div>
        </div>
      </div>

      {/* Scoring Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Scoring System:</h5>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Correct Answer:</span>
            <span className="font-medium text-green-600">+10 points</span>
          </div>
          <div className="flex justify-between">
            <span>Speed Bonus:</span>
            <span className="font-medium text-blue-600">+1-5 points</span>
          </div>
          <div className="flex justify-between">
            <span>Wrong Answer:</span>
            <span className="font-medium text-red-600">0 points</span>
          </div>
        </div>
      </div>

      {/* Ready Indicator */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">
            Quiz configured and ready to start!
          </span>
        </div>
      </div>
    </div>
  )
}

export default QuizInfoCard