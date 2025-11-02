"use client"

import React from 'react'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { LeaderboardSnapshotProps } from '../types'
import { mockLeaderboard } from '../mockData'

const LeaderboardSnapshot: React.FC<LeaderboardSnapshotProps> = ({
  leaderboard = mockLeaderboard,
  currentUserId
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500">#{rank}</div>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600'
      case 2: return 'from-gray-300 to-gray-500'
      case 3: return 'from-amber-400 to-amber-600'
      default: return 'from-blue-400 to-blue-600'
    }
  }

  const currentUserRank = leaderboard.find(entry => entry.playerId === currentUserId)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Leaderboard</h3>
            <p className="text-sm text-gray-500">Top performers from last round</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Live Rankings</span>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No Previous Results</h4>
          <p className="text-sm text-gray-500 mb-4">
            Complete your first quiz to see rankings here!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              🎯 Be the first to claim the top spot!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.slice(0, 3).map((entry, index) => (
            <div
              key={entry.playerId}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${entry.playerId === currentUserId 
                  ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200' 
                  : 'border-gray-200 bg-gray-50'
                }
              `}
            >
              {/* Rank Badge */}
              <div className={`
                absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center
                bg-gradient-to-br ${getRankColor(entry.rank)} text-white shadow-md
              `}>
                {getRankIcon(entry.rank)}
              </div>

              <div className="flex items-center justify-between ml-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="text-2xl w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {entry.avatar}
                  </div>

                  {/* Player Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {entry.playerName}
                        {entry.playerId === currentUserId && (
                          <span className="text-xs text-blue-600 ml-1">(You)</span>
                        )}
                      </span>
                      {entry.rank === 1 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Champion
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Rank #{entry.rank}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">
                    {entry.score}
                  </div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 ml-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getRankColor(entry.rank)}`}
                    style={{ width: `${(entry.score / Math.max(...leaderboard.map(e => e.score))) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Current User Position (if not in top 3) */}
          {currentUserRank && currentUserRank.rank > 3 && (
            <div className="border-t border-gray-200 pt-3 mt-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{currentUserRank.avatar}</div>
                    <div>
                      <span className="font-medium text-blue-800">Your Position</span>
                      <div className="text-sm text-blue-600">Rank #{currentUserRank.rank}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-800">{currentUserRank.score}</div>
                    <div className="text-xs text-blue-600">points</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-yellow-600">
                  {leaderboard[0]?.score || 0}
                </div>
                <div className="text-xs text-gray-500">Top Score</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length) || 0}
                </div>
                <div className="text-xs text-gray-500">Average</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {leaderboard.length}
                </div>
                <div className="text-xs text-gray-500">Players</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Motivation Message */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
        <p className="text-sm text-purple-700 text-center">
          {currentUserRank?.rank === 1 
            ? "🏆 Defend your crown in the next quiz!"
            : currentUserRank?.rank && currentUserRank.rank <= 3
            ? "🎯 You're in the top 3! Can you reach #1?"
            : "💪 Climb the leaderboard in the next quiz!"
          }
        </p>
      </div>
    </div>
  )
}

export default LeaderboardSnapshot