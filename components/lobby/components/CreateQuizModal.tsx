"use client"

import React, { useState } from 'react'
import { X, Plus, Trash2, Save, BookOpen, HelpCircle } from 'lucide-react'
import { CreateQuizModalProps, CustomQuestion } from '../types'

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [quizTitle, setQuizTitle] = useState('')
  const [questions, setQuestions] = useState<CustomQuestion[]>([
    {
      id: '1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    }
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId))
    }
  }

  const updateQuestion = (questionId: string, field: keyof CustomQuestion, value: any) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ))
  }

  const validateQuiz = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!quizTitle.trim()) {
      newErrors.title = 'Quiz title is required'
    }

    questions.forEach((q, index) => {
      if (!q.question.trim()) {
        newErrors[`question_${q.id}`] = `Question ${index + 1} is required`
      }

      const filledOptions = q.options.filter(opt => opt.trim())
      if (filledOptions.length < 2) {
        newErrors[`options_${q.id}`] = `Question ${index + 1} needs at least 2 options`
      }

      if (!q.correctAnswer.trim() || !q.options.includes(q.correctAnswer)) {
        newErrors[`correct_${q.id}`] = `Question ${index + 1} needs a valid correct answer`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateQuiz()) {
      onSave({
        title: quizTitle,
        questions: questions.filter(q => q.question.trim())
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setQuizTitle('')
    setQuestions([{
      id: '1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    }])
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Create Custom Quiz</h2>
              <p className="text-sm text-gray-500">Design your own quiz questions</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quiz Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Title *
            </label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Questions</h3>
              <button
                onClick={addQuestion}
                className="flex items-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Question {questionIndex + 1}</h4>
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question *
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      placeholder="Enter your question..."
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none ${
                        errors[`question_${question.id}`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors[`question_${question.id}`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`question_${question.id}`]}</p>
                    )}
                  </div>

                  {/* Options */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options * (at least 2 required)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500 w-6">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          />
                        </div>
                      ))}
                    </div>
                    {errors[`options_${question.id}`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`options_${question.id}`]}</p>
                    )}
                  </div>

                  {/* Correct Answer */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer *
                    </label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                        errors[`correct_${question.id}`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select correct answer...</option>
                      {question.options.map((option, index) => (
                        option.trim() && (
                          <option key={index} value={option}>
                            {String.fromCharCode(65 + index)}. {option}
                          </option>
                        )
                      ))}
                    </select>
                    {errors[`correct_${question.id}`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`correct_${question.id}`]}</p>
                    )}
                  </div>

                  {/* Explanation (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={question.explanation || ''}
                      onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                      placeholder="Explain why this is the correct answer..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-purple-800 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Tips for Creating Great Quizzes
            </h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Keep questions clear and concise</li>
              <li>• Provide 4 answer options when possible</li>
              <li>• Make sure only one answer is clearly correct</li>
              <li>• Add explanations to help players learn</li>
              <li>• Test your quiz before sharing with others</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="text-sm text-gray-600">
            {questions.filter(q => q.question.trim()).length} question(s) ready
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Create Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateQuizModal