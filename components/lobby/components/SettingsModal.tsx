"use client"

import React, { useState, useEffect } from 'react'
import { X, Settings, Clock, Hash, Target, HelpCircle, Eye } from 'lucide-react'
import { SettingsModalProps, QuizSettings } from '../types'
import { availableTopics } from '../mockData'

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSettings
}) => {
  const [settings, setSettings] = useState<QuizSettings>(currentSettings)
  const [errors, setErrors] = useState<Partial<Record<keyof QuizSettings, string>>>({})

  useEffect(() => {
    if (isOpen) {
      setSettings(currentSettings)
      setErrors({})
    }
  }, [isOpen, currentSettings])

  const validateSettings = (): boolean => {
    const newErrors: Partial<Record<keyof QuizSettings, string>> = {}

    if (settings.questionCount < 5 || settings.questionCount > 50) {
      newErrors.questionCount = 'Question count must be between 5 and 50'
    }

    if (settings.timePerQuestion < 10 || settings.timePerQuestion > 300) {
      newErrors.timePerQuestion = 'Time per question must be between 10 and 300 seconds'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateSettings()) {
      onSave(settings)
    }
  }

  const handleInputChange = (field: keyof QuizSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Quiz Settings</h2>
              <p className="text-sm text-gray-500">Configure your quiz parameters</p>
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
          {/* Topic Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4" />
              Quiz Topic
            </label>
            <select
              value={settings.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={settings.isCustomQuiz}
            >
              {settings.isCustomQuiz ? (
                <option value={settings.topic}>{settings.topic} (Custom Quiz)</option>
              ) : (
                availableTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))
              )}
            </select>
            {settings.isCustomQuiz && (
              <p className="text-sm text-purple-600 mt-1">
                This is a custom quiz. Create a new quiz to change the topic.
              </p>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4" />
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Easy', 'Medium', 'Hard'] as const).map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => handleInputChange('difficulty', difficulty)}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-200
                    ${settings.difficulty === difficulty
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4" />
              Number of Questions
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={settings.questionCount}
              onChange={(e) => handleInputChange('questionCount', parseInt(e.target.value) || 10)}
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                ${errors.questionCount ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            {errors.questionCount && (
              <p className="text-sm text-red-600 mt-1">{errors.questionCount}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Choose between 5-50 questions</p>
          </div>

          {/* Time per Question */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Time per Question (seconds)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              value={settings.timePerQuestion}
              onChange={(e) => handleInputChange('timePerQuestion', parseInt(e.target.value) || 30)}
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                ${errors.timePerQuestion ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            {errors.timePerQuestion && (
              <p className="text-sm text-red-600 mt-1">{errors.timePerQuestion}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">10-300 seconds per question</p>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Additional Options
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.allowHints}
                  onChange={(e) => handleInputChange('allowHints', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Allow Hints</span>
                  <p className="text-xs text-gray-500">Players can request hints during the quiz</p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.showCorrectAnswers}
                  onChange={(e) => handleInputChange('showCorrectAnswers', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Show Correct Answers</span>
                  <p className="text-xs text-gray-500">Display correct answers after each question</p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Quiz Preview
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Topic:</strong> {settings.topic}</p>
              <p><strong>Difficulty:</strong> {settings.difficulty}</p>
              <p><strong>Questions:</strong> {settings.questionCount}</p>
              <p><strong>Time per question:</strong> {settings.timePerQuestion}s</p>
              <p><strong>Estimated duration:</strong> {Math.ceil((settings.questionCount * settings.timePerQuestion) / 60)} minutes</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal