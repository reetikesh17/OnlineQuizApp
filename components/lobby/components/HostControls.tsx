"use client"

import React from 'react'
import { Play, Settings, UserX, Users, AlertCircle } from 'lucide-react'
import { HostControlsProps } from '../types'

const HostControls: React.FC<HostControlsProps> = ({
  onStartQuiz,
  onEditSettings,
  onKickPlayer,
  canStartQuiz,
  playerCount
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Host Controls</h3>
          <p className="text-sm text-gray-500">Manage your quiz room</p>
        </div>
      </div>

      {/* Start Quiz Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-700">Start Quiz</h4>
          <span className="text-sm text-gray-500">{playerCount} players</span>
        </div>
        
        {!canStartQuiz && (
          <div className="flex items-center gap-2 mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">
              Need at least 2 players and 1 ready player to start
            </span>
          </div>
        )}

        <button
          onClick={onStartQuiz}
          disabled={!canStartQuiz}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
            ${canStartQuiz
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Play className="w-5 h-5" />
          <span>Start Quiz</span>
        </button>
      </div>

      {/* Room Management */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 mb-3">Room Management</h4>
        
        <button
          onClick={onEditSettings}
          className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Edit Settings</div>
            <div className="text-sm text-blue-600">Configure quiz options</div>
          </div>
        </button>

        <button
          onClick={() => onKickPlayer('')}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
          disabled={playerCount <= 1}
        >
          <UserX className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Manage Players</div>
            <div className="text-sm text-red-600">
              {playerCount <= 1 ? 'No players to manage' : 'Remove disruptive players'}
            </div>
          </div>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-blue-600">{playerCount}</div>
            <div className="text-xs text-gray-500">Players</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {canStartQuiz ? '✓' : '✗'}
            </div>
            <div className="text-xs text-gray-500">Ready</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-purple-600">10</div>
            <div className="text-xs text-gray-500">Questions</div>
          </div>
        </div>
      </div>

      {/* Host Tips */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h5 className="text-sm font-medium text-gray-700 mb-2">💡 Host Tips</h5>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Wait for players to mark themselves as ready</li>
          <li>• Use settings to adjust difficulty and timing</li>
          <li>• Keep the room code handy for late joiners</li>
        </ul>
      </div>
    </div>
  )
}

export default HostControls