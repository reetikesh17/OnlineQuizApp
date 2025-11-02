"use client"

import React from 'react'
import { Crown, Check, Clock, Wifi, WifiOff, UserX } from 'lucide-react'
import { PlayerListProps } from '../types'

const PlayerListPanel: React.FC<PlayerListProps> = ({
  players,
  currentUserId,
  onKickPlayer,
  onToggleReady,
  isHost
}) => {
  const handleReadyToggle = (playerId: string) => {
    if (playerId === currentUserId) {
      onToggleReady(playerId)
    }
  }

  const handleKickPlayer = (playerId: string) => {
    if (isHost && onKickPlayer && playerId !== currentUserId) {
      onKickPlayer(playerId)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Players ({players.filter(p => p.isOnline).length})
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Wifi className="w-4 h-4" />
          <span>{players.filter(p => p.isOnline).length} online</span>
        </div>
      </div>

      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200
              ${player.isHost 
                ? 'border-yellow-400 bg-yellow-50 shadow-md' 
                : 'border-gray-200 bg-gray-50'
              }
              ${player.isReady && player.isOnline 
                ? 'animate-pulse ring-2 ring-green-200' 
                : ''
              }
              ${!player.isOnline ? 'opacity-60' : ''}
            `}
          >
            {/* Host crown */}
            {player.isHost && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-yellow-400 rounded-full p-1">
                  <Crown className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className={`
                  text-2xl w-12 h-12 rounded-full flex items-center justify-center
                  ${player.isReady && player.isOnline 
                    ? 'bg-green-100 ring-2 ring-green-300' 
                    : 'bg-gray-100'
                  }
                `}>
                  {player.avatar}
                </div>

                {/* Player info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">
                      {player.username}
                      {player.id === currentUserId && (
                        <span className="text-xs text-blue-600 ml-1">(You)</span>
                      )}
                    </span>
                    {player.isHost && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Host
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    {/* Online status */}
                    {player.isOnline ? (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Wifi className="w-3 h-3" />
                        <span>Online</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <WifiOff className="w-3 h-3" />
                        <span>Offline</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ready status and actions */}
              <div className="flex items-center gap-2">
                {/* Ready status button */}
                {player.isOnline && (
                  <button
                    onClick={() => handleReadyToggle(player.id)}
                    disabled={player.id !== currentUserId}
                    className={`
                      p-2 rounded-full transition-all duration-200
                      ${player.isReady 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }
                      ${player.id === currentUserId 
                        ? 'cursor-pointer' 
                        : 'cursor-default opacity-60'
                      }
                    `}
                    title={
                      player.id === currentUserId 
                        ? (player.isReady ? 'Click to mark as not ready' : 'Click to mark as ready')
                        : (player.isReady ? 'Ready' : 'Not ready')
                    }
                  >
                    {player.isReady ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </button>
                )}

                {/* Kick button (host only) */}
                {isHost && onKickPlayer && player.id !== currentUserId && (
                  <button
                    onClick={() => handleKickPlayer(player.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title={`Kick ${player.username}`}
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Ready status text */}
            <div className="mt-2 text-xs text-center">
              {player.isOnline ? (
                <span className={player.isReady ? 'text-green-600 font-medium' : 'text-gray-500'}>
                  {player.isReady ? '✅ Ready to start!' : '⏳ Getting ready...'}
                </span>
              ) : (
                <span className="text-gray-400">💤 Offline</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Player stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-green-600">
              {players.filter(p => p.isOnline && p.isReady).length}
            </div>
            <div className="text-gray-500">Ready</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">
              {players.filter(p => p.isOnline).length}
            </div>
            <div className="text-gray-500">Online</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerListPanel