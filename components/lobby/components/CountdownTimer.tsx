"use client"

import React, { useEffect, useState } from 'react'
import { X, Play } from 'lucide-react'
import { CountdownProps } from '../types'
import { formatCountdownTime, getCountdownColor } from '../utils'

const CountdownTimer: React.FC<CountdownProps> = ({
  isActive,
  duration,
  onComplete,
  onCancel
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setTimeRemaining(duration)
  }, [duration])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsAnimating(true)
          setTimeout(() => {
            onComplete()
          }, 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onComplete])

  if (!isActive && timeRemaining === duration) return null

  const percentage = (timeRemaining / duration) * 100
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const color = getCountdownColor(timeRemaining, duration)

  return (
    <div className="flex flex-col items-center">
      {/* Countdown Circle */}
      <div className="relative">
        <svg
          className="w-32 h-32 transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${
              isAnimating ? 'animate-pulse' : ''
            }`}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className={`text-3xl font-bold transition-colors duration-500`}
            style={{ color }}
          >
            {timeRemaining}
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {timeRemaining === 1 ? 'second' : 'seconds'}
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {timeRemaining > 0 ? 'Quiz Starting Soon!' : 'Starting Quiz...'}
        </h3>
        <p className="text-sm text-gray-600">
          {timeRemaining > 0 
            ? 'Get ready for an awesome quiz experience!'
            : 'Loading questions...'
          }
        </p>
      </div>

      {/* Action Buttons */}
      {timeRemaining > 0 && (
        <div className="mt-4 flex items-center gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}
          
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
            <Play className="w-4 h-4" />
            <span>Starting in {formatCountdownTime(timeRemaining)}</span>
          </div>
        </div>
      )}

      {/* Confetti Animation Trigger */}
      {timeRemaining === 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
          
          {/* Simple confetti effect */}
          <div className="absolute top-1/4 left-1/4 animate-ping">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          </div>
          <div className="absolute top-1/3 right-1/4 animate-ping delay-100">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          </div>
          <div className="absolute top-1/2 left-1/3 animate-ping delay-200">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
          <div className="absolute top-2/3 right-1/3 animate-ping delay-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="absolute top-3/4 left-1/2 animate-ping delay-500">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Progress Bar (Alternative view for mobile) */}
      <div className="mt-6 w-full max-w-xs md:hidden">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>{duration}s</span>
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer