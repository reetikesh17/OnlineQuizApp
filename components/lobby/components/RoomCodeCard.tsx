"use client"

import React, { useState } from 'react'
import { Copy, Share2, Check, QrCode, Users } from 'lucide-react'
import { RoomCodeCardProps } from '../types'
import { copyToClipboard, shareInvite } from '../utils'

const RoomCodeCard: React.FC<RoomCodeCardProps> = ({
  roomCode,
  onCopyCode,
  onShareInvite
}) => {
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  const handleCopyCode = async () => {
    const success = await copyToClipboard(roomCode)
    if (success) {
      setCopied(true)
      onCopyCode()
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareInvite = async () => {
    setSharing(true)
    try {
      await shareInvite(roomCode)
      onShareInvite()
    } catch (error) {
      console.error('Failed to share:', error)
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white border border-blue-400">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white bg-opacity-90 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Room Code</h3>
            <p className="text-blue-50 text-sm font-medium">Share with friends to join</p>
          </div>
        </div>
        <button className="p-2 bg-white bg-opacity-90 rounded-lg hover:bg-white transition-colors">
          <QrCode className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* Room Code Display */}
      <div className="bg-white rounded-lg p-6 mb-4 shadow-inner">
        <div className="text-center">
          <div className="text-4xl font-black tracking-widest mb-3 font-mono text-gray-800 bg-gray-100 rounded-lg py-3 px-4">
            {roomCode}
          </div>
          <p className="text-gray-600 text-sm font-semibold">
            Enter this code to join the quiz
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopyCode}
          disabled={copied}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md
            ${copied
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-white text-blue-700 hover:bg-blue-50'
            }
          `}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </>
          )}
        </button>

        <button
          onClick={handleShareInvite}
          disabled={sharing}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-200 shadow-md"
        >
          <Share2 className={`w-4 h-4 ${sharing ? 'animate-pulse' : ''}`} />
          <span>{sharing ? 'Sharing...' : 'Share Invite'}</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-white bg-opacity-95 rounded-lg shadow-inner">
        <h4 className="text-sm font-bold mb-3 text-gray-800">How to join:</h4>
        <ol className="text-sm text-gray-700 space-y-2 font-medium">
          <li className="flex items-start gap-2">
            <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
            <span>Open QuizMaster on any device</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
            <span>Click "Join Room" or "Enter Code"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
            <span>Type the room code: <span className="font-mono font-bold bg-gray-200 px-2 py-1 rounded text-gray-800">{roomCode}</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
            <span>Click "Join" and get ready to play!</span>
          </li>
        </ol>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 flex items-center justify-between text-sm bg-white bg-opacity-90 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
          <span className="text-gray-700 font-semibold">Room Active</span>
        </div>
        <div className="text-gray-700 font-semibold">
          Max 8 players
        </div>
      </div>
    </div>
  )
}

export default RoomCodeCard