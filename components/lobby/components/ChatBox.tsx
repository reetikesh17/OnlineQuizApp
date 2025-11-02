"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Send, Smile, MessageCircle } from 'lucide-react'
import { ChatBoxProps } from '../types'
import { formatMessageTime, sanitizeMessage } from '../utils'
import { useChatScroll } from '../hooks'
import { commonEmojis } from '../mockData'

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  onSendEmoji,
  currentUserId
}) => {
  const [messageInput, setMessageInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { chatContainerRef, handleScroll } = useChatScroll(messages)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = () => {
    const trimmedMessage = messageInput.trim()
    if (trimmedMessage && trimmedMessage.length <= 200) {
      onSendMessage(sanitizeMessage(trimmedMessage))
      setMessageInput('')
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiClick = (emoji: string) => {
    onSendEmoji(emoji)
    setShowEmojiPicker(false)
  }

  const isOwnMessage = (senderId: string) => senderId === currentUserId

  return (
    <div className="bg-white rounded-xl shadow-lg h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Chat</h3>
        </div>
        <div className="text-sm text-gray-500">
          {messages.length} messages
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isOwnMessage(message.senderId) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-lg px-3 py-2 text-sm
                  ${isOwnMessage(message.senderId)
                    ? 'bg-blue-500 text-white'
                    : message.type === 'system'
                    ? 'bg-gray-100 text-gray-600 italic'
                    : 'bg-gray-100 text-gray-800'
                  }
                `}
              >
                {/* Sender name (for others' messages) */}
                {!isOwnMessage(message.senderId) && message.type !== 'system' && (
                  <div className="text-xs font-medium mb-1 text-gray-600">
                    {message.senderName}
                  </div>
                )}

                {/* Message content */}
                <div className={`
                  ${message.type === 'emoji' ? 'text-lg' : ''}
                `}>
                  {message.content}
                </div>

                {/* Timestamp */}
                <div className={`
                  text-xs mt-1 opacity-70
                  ${isOwnMessage(message.senderId) ? 'text-blue-100' : 'text-gray-500'}
                `}>
                  {formatMessageTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="border-t border-gray-200 p-3">
          <div className="grid grid-cols-6 gap-2">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`
              p-2 rounded-lg transition-colors
              ${showEmojiPicker 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <Smile className="w-4 h-4" />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {messageInput.length}/200
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className={`
              p-2 rounded-lg transition-colors
              ${messageInput.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Quick reactions */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-xs text-gray-500 mr-2">Quick:</span>
          {['👍', '😂', '🎉', '🤔'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="text-sm p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatBox