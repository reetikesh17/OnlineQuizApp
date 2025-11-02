"use client"

import React from 'react'
import { Lightbulb, RotateCcw, Sparkles } from 'lucide-react'
import { FunFactWidgetProps } from '../types'
import { funFacts } from '../mockData'
import { useFunFacts } from '../hooks'

const FunFactWidget: React.FC<FunFactWidgetProps> = ({
  facts = funFacts,
  rotationInterval = 5000
}) => {
  const { currentFact, currentFactIndex } = useFunFacts(facts, rotationInterval)

  const handleNextFact = () => {
    // Force next fact by triggering a re-render with a different interval
    window.location.reload = () => {}
  }

  if (!facts.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Fun Facts</h3>
            <p className="text-sm text-gray-500">No facts available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Did You Know?</h3>
            <p className="text-sm text-yellow-700">Fun facts while you wait</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-600 animate-pulse" />
          <button
            onClick={handleNextFact}
            className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
            title="Next fact"
          >
            <RotateCcw className="w-4 h-4 text-yellow-600" />
          </button>
        </div>
      </div>

      {/* Fact Content */}
      <div className="mb-4">
        <div 
          key={currentFactIndex} // Key change triggers animation
          className="text-gray-700 text-sm leading-relaxed animate-fade-in"
        >
          {currentFact}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {facts.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${index === currentFactIndex 
                    ? 'bg-yellow-500 w-4' 
                    : 'bg-yellow-300'
                  }
                `}
              />
            ))}
          </div>
          <span className="text-xs text-yellow-700">
            {currentFactIndex + 1} of {facts.length}
          </span>
        </div>

        <div className="text-xs text-yellow-600">
          Auto-rotating every {rotationInterval / 1000}s
        </div>
      </div>

      {/* Fun Categories */}
      <div className="mt-4 pt-4 border-t border-yellow-200">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            🧠 Tech Trivia
          </span>
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
            🔬 Science Facts
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            💻 Programming
          </span>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-yellow-600">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
          <span>Learning while waiting...</span>
        </div>
      </div>

      {/* Custom CSS for fade animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default FunFactWidget