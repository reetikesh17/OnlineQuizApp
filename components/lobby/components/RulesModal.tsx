"use client"

import React from 'react'
import { X, BookOpen, Clock, Award, AlertCircle } from 'lucide-react'
import { RulesModalProps } from '../types'

const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Quiz Rules</h2>
              <p className="text-sm text-gray-500">Everything you need to know</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* How to Play */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              How to Play
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>1. <strong>Wait for the host</strong> to start the quiz</p>
              <p>2. <strong>Read each question</strong> carefully and select your answer</p>
              <p>3. <strong>Submit your answer</strong> before time runs out</p>
              <p>4. <strong>View results</strong> and see your score after each question</p>
              <p>5. <strong>Check the leaderboard</strong> to see how you rank against others</p>
            </div>
          </section>

          {/* Scoring System */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Scoring System
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Correct Answer:</span>
                  <span className="font-semibold text-green-600">+10 points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Speed Bonus (answered quickly):</span>
                  <span className="font-semibold text-blue-600">+1 to +5 points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Wrong Answer:</span>
                  <span className="font-semibold text-red-600">0 points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>No Answer (time up):</span>
                  <span className="font-semibold text-gray-600">0 points</span>
                </div>
              </div>
            </div>
          </section>

          {/* Time Limits */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Time Limits
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Each question has a <strong>time limit</strong> set by the host</p>
              <p>• A <strong>countdown timer</strong> shows remaining time</p>
              <p>• Answer <strong>quickly</strong> to earn speed bonus points</p>
              <p>• If time runs out, your answer is automatically submitted</p>
            </div>
          </section>

          {/* Game Features */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Game Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-1">Hints</h4>
                <p className="text-xs text-blue-700">
                  If enabled, you can request hints for difficult questions
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-green-800 mb-1">Correct Answers</h4>
                <p className="text-xs text-green-700">
                  See the correct answer after each question (if enabled)
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <h4 className="font-medium text-purple-800 mb-1">Real-time Leaderboard</h4>
                <p className="text-xs text-purple-700">
                  Track your ranking throughout the quiz
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-medium text-yellow-800 mb-1">Chat</h4>
                <p className="text-xs text-yellow-700">
                  Communicate with other players during the lobby
                </p>
              </div>
            </div>
          </section>

          {/* Fair Play */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Fair Play Guidelines
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="space-y-2 text-sm text-red-800">
                <p>• <strong>No cheating:</strong> Don't use external resources during the quiz</p>
                <p>• <strong>Be respectful:</strong> Keep chat messages appropriate and friendly</p>
                <p>• <strong>Play fair:</strong> Don't share answers with other players</p>
                <p>• <strong>Stay focused:</strong> Avoid distractions during the quiz</p>
              </div>
            </div>
          </section>

          {/* Technical Requirements */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Requirements</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• <strong>Stable internet connection</strong> for real-time updates</p>
              <p>• <strong>Modern web browser</strong> (Chrome, Firefox, Safari, Edge)</p>
              <p>• <strong>JavaScript enabled</strong> for interactive features</p>
              <p>• <strong>Screen size:</strong> Works on desktop, tablet, and mobile</p>
            </div>
          </section>

          {/* Tips for Success */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Success</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2 text-sm text-gray-700">
                <p>🎯 <strong>Read carefully:</strong> Take time to understand each question</p>
                <p>⚡ <strong>Think fast:</strong> Quick answers earn bonus points</p>
                <p>🧠 <strong>Stay calm:</strong> Don't panic if you don't know an answer</p>
                <p>🎉 <strong>Have fun:</strong> Enjoy the competitive experience!</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

export default RulesModal