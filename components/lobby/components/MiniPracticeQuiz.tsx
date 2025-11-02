"use client"

import React, { useState } from 'react'
import { Play, RotateCcw, CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import { MiniPracticeQuizProps } from '../types'
import { getRandomPracticeQuestion } from '../mockData'
import { usePracticeQuiz } from '../hooks'

const MiniPracticeQuiz: React.FC<MiniPracticeQuizProps> = ({
  question: initialQuestion,
  onAnswer
}) => {
  const [currentQuestion] = useState(initialQuestion || getRandomPracticeQuestion())
  const {
    selectedAnswer,
    showResult,
    hasAnswered,
    selectAnswer,
    submitAnswer,
    resetQuiz
  } = usePracticeQuiz()

  const handleAnswerSelect = (answer: string) => {
    selectAnswer(answer)
    if (onAnswer) {
      onAnswer(answer)
    }
  }

  const handleTryAgain = () => {
    resetQuiz()
    // In a real app, you might fetch a new question here
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Play className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Practice Question</h3>
            <p className="text-sm text-gray-500">Warm up before the real quiz!</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          <Lightbulb className="w-4 h-4" />
          <span>Practice Mode</span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-800 mb-3">
          {currentQuestion.question}
        </h4>

        {/* Answer Options */}
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => {
            let buttonStyle = "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            
            if (hasAnswered) {
              if (option === currentQuestion.correctAnswer) {
                buttonStyle = "border-green-500 bg-green-50 text-green-700"
              } else if (option === selectedAnswer && !isCorrect) {
                buttonStyle = "border-red-500 bg-red-50 text-red-700"
              } else {
                buttonStyle = "border-gray-200 bg-gray-50 text-gray-500"
              }
            } else if (selectedAnswer === option) {
              buttonStyle = "border-blue-500 bg-blue-50 text-blue-700"
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={hasAnswered}
                className={`
                  w-full text-left p-3 border-2 rounded-lg transition-all duration-200
                  ${buttonStyle}
                  ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {hasAnswered && option === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {hasAnswered && option === selectedAnswer && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      {!hasAnswered ? (
        <button
          onClick={submitAnswer}
          disabled={!selectedAnswer}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
            ${selectedAnswer
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Play className="w-4 h-4" />
          <span>Submit Answer</span>
        </button>
      ) : (
        <div className="space-y-3">
          {/* Result */}
          <div className={`
            p-4 rounded-lg border-2
            ${isCorrect 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
            }
          `}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Incorrect</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-700">
              {currentQuestion.explanation}
            </p>
          </div>

          {/* Try Again Button */}
          <button
            onClick={handleTryAgain}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Another Question</span>
          </button>
        </div>
      )}

      {/* Practice Tips */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="text-sm font-medium text-blue-800 mb-1">💡 Practice Tips:</h5>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Take your time to read each question carefully</li>
          <li>• Practice questions don't affect your score</li>
          <li>• Use this to get familiar with the question format</li>
        </ul>
      </div>
    </div>
  )
}

export default MiniPracticeQuiz