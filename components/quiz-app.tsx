"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Timer, Award, CheckCircle, LogOut, Home, UserIcon } from "lucide-react"

// Types
interface QuizAppUser {
  id: string
  name: string
  email: string
  score: number
  quizzesCompleted: number
}

interface Question {
  id: string
  type: "radio" | "checkbox" | "text" | "boolean"
  question: string
  options?: string[]
  correctAnswer: string | string[]
}

interface Quiz {
  id: string
  title: string
  description: string
  duration: number
  questions: Question[]
  category: string
}

interface QuizAttempt {
  quizId: string
  answers: Record<string, string | string[]>
  score: number
  totalQuestions: number
  completedAt: Date
}

// Context
interface AppContextType {
  user: QuizAppUser | null
  login: (email: string, password: string) => void
  logout: () => void
  quizzes: Quiz[]
  currentQuiz: Quiz | null
  startQuiz: (quizId: string) => void
  submitQuiz: (answers: Record<string, string | string[]>) => QuizAttempt
  lastAttempt: QuizAttempt | null
}

const AppContext = createContext<AppContextType | null>(null)

const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}

// Mock Data
const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of core JavaScript concepts",
    duration: 300,
    category: "Programming",
    questions: [
      {
        id: "q1",
        type: "radio",
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["variable x = 5", "let x = 5", "v x = 5", "dim x = 5"],
        correctAnswer: "let x = 5",
      },
      {
        id: "q2",
        type: "checkbox",
        question: "Which of the following are JavaScript data types?",
        options: ["String", "Number", "Boolean", "Character"],
        correctAnswer: ["String", "Number", "Boolean"],
      },
      {
        id: "q3",
        type: "boolean",
        question: "JavaScript is a compiled language.",
        correctAnswer: "false",
      },
      {
        id: "q4",
        type: "text",
        question: "What keyword is used to create a function in JavaScript?",
        correctAnswer: "function",
      },
    ],
  },
  {
    id: "2",
    title: "React Basics",
    description: "Understand the fundamentals of React",
    duration: 240,
    category: "Programming",
    questions: [
      {
        id: "q1",
        type: "radio",
        question: "What is JSX?",
        options: ["A JavaScript extension", "A CSS framework", "A database", "A server"],
        correctAnswer: "A JavaScript extension",
      },
      {
        id: "q2",
        type: "boolean",
        question: "React uses a virtual DOM.",
        correctAnswer: "true",
      },
      {
        id: "q3",
        type: "text",
        question: "What hook is used to manage state in functional components?",
        correctAnswer: "useState",
      },
    ],
  },
  {
    id: "3",
    title: "General Knowledge",
    description: "Test your general knowledge",
    duration: 180,
    category: "General",
    questions: [
      {
        id: "q1",
        type: "radio",
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
      },
      {
        id: "q2",
        type: "boolean",
        question: "The Earth is flat.",
        correctAnswer: "false",
      },
    ],
  },
]

// App Provider
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<QuizAppUser | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null)

  useEffect(() => {
    // Simulate fetching user data from a server
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  const login = (email: string, password: string) => {
    setUser({
      id: "1",
      name: email.split("@")[0],
      email,
      score: 850,
      quizzesCompleted: 12,
    })
  }

  const logout = () => {
    setUser(null)
    setCurrentQuiz(null)
    setLastAttempt(null)
  }

  const startQuiz = (quizId: string) => {
    const quiz = mockQuizzes.find((q) => q.id === quizId)
    if (quiz) setCurrentQuiz(quiz)
  }

  const submitQuiz = (answers: Record<string, string | string[]>) => {
    if (!currentQuiz) throw new Error("No active quiz")

    let correct = 0
    currentQuiz.questions.forEach((q) => {
      const userAnswer = answers[q.id]
      if (Array.isArray(q.correctAnswer) && Array.isArray(userAnswer)) {
        if (JSON.stringify(q.correctAnswer.sort()) === JSON.stringify(userAnswer.sort())) {
          correct++
        }
      } else if (typeof userAnswer === "string" && typeof q.correctAnswer === "string") {
        if (userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
          correct++
        }
      }
    })

    const attempt: QuizAttempt = {
      quizId: currentQuiz.id,
      answers,
      score: correct,
      totalQuestions: currentQuiz.questions.length,
      completedAt: new Date(),
    }

    setLastAttempt(attempt)
    setCurrentQuiz(null)

    if (user) {
      setUser({
        ...user,
        quizzesCompleted: user.quizzesCompleted + 1,
        score: user.score + correct * 10,
      })
    }

    return attempt
  }

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        quizzes: mockQuizzes,
        currentQuiz,
        startQuiz,
        submitQuiz,
        lastAttempt,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Components
const Button: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  className?: string
  disabled?: boolean
}> = ({ children, onClick, variant = "primary", className = "", disabled }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>{children}</div>
)

// Pages
const Landing: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div className="max-w-4xl w-full text-center text-white">
      <Award className="w-24 h-24 mx-auto mb-6" />
      <h1 className="text-5xl font-bold mb-4">QuizMaster Pro</h1>
      <p className="text-xl mb-8 opacity-90">Challenge yourself with interactive quizzes and track your progress</p>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-gray-800">
          <Timer className="w-12 h-12 mx-auto mb-3 text-blue-600" />
          <h3 className="font-semibold mb-2">Timed Challenges</h3>
          <p className="text-sm text-gray-600">Race against the clock</p>
        </Card>
        <Card className="text-gray-800">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
          <h3 className="font-semibold mb-2">Instant Feedback</h3>
          <p className="text-sm text-gray-600">See your results immediately</p>
        </Card>
        <Card className="text-gray-800">
          <Award className="w-12 h-12 mx-auto mb-3 text-purple-600" />
          <h3 className="font-semibold mb-2">Track Progress</h3>
          <p className="text-sm text-gray-600">Monitor your improvement</p>
        </Card>
      </div>
      <Button onClick={onGetStarted} className="text-lg px-8 py-3">
        Get Started
      </Button>
    </div>
  </div>
)

const Auth: React.FC<{ onLogin: (email: string, password: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    if (email && password) {
      onLogin(email, password)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Sign In
          </Button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">Demo: Use any email and password</p>
      </Card>
    </div>
  )
}

const QuizLobby: React.FC = () => {
  const { quizzes, startQuiz } = useApp()

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Available Quizzes</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{quiz.category}</span>
            </div>
            <p className="text-gray-600 mb-4 text-sm">{quiz.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {Math.floor(quiz.duration / 60)} min
              </span>
              <span>{quiz.questions.length} questions</span>
            </div>
            <Button onClick={() => startQuiz(quiz.id)} className="w-full">
              Start Quiz
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

const QuizPage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentQuiz, submitQuiz } = useApp()
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [timeLeft, setTimeLeft] = useState(currentQuiz?.duration || 0)

  useEffect(() => {
    if (!currentQuiz) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentQuiz])

  const handleSubmit = () => {
    submitQuiz(answers)
    onComplete()
  }

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  if (!currentQuiz) return null

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{currentQuiz.title}</h1>
        <div
          className={`flex items-center gap-2 text-lg font-semibold ${
            timeLeft < 60 ? "text-red-600" : "text-gray-700"
          }`}
        >
          <Timer className="w-5 h-5" />
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="space-y-6">
        {currentQuiz.questions.map((q, idx) => (
          <Card key={q.id}>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Question {idx + 1}</span>
              <h3 className="text-lg font-semibold text-gray-800 mt-1">{q.question}</h3>
            </div>

            {q.type === "radio" && q.options && (
              <div className="space-y-2">
                {q.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "checkbox" && q.options && (
              <div className="space-y-2">
                {q.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={((answers[q.id] as string[]) || []).includes(option)}
                      onChange={(e) => {
                        const current = (answers[q.id] as string[]) || []
                        const updated = e.target.checked ? [...current, option] : current.filter((v) => v !== option)
                        handleAnswerChange(q.id, updated)
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "boolean" && (
              <div className="space-y-2">
                {["true", "false"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "text" && (
              <input
                type="text"
                value={(answers[q.id] as string) || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Type your answer..."
              />
            )}
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSubmit} className="px-8">
          Submit Quiz
        </Button>
      </div>
    </div>
  )
}

const Results: React.FC<{ onBackToLobby: () => void }> = ({ onBackToLobby }) => {
  const { lastAttempt, quizzes } = useApp()
  if (!lastAttempt) return null

  const quiz = quizzes.find((q) => q.id === lastAttempt.quizId)
  const percentage = (lastAttempt.score / lastAttempt.totalQuestions) * 100

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="text-center">
        <Award
          className={`w-24 h-24 mx-auto mb-6 ${
            percentage >= 70 ? "text-green-600" : percentage >= 50 ? "text-yellow-600" : "text-red-600"
          }`}
        />
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Quiz Completed!</h1>
        <p className="text-gray-600 mb-8">{quiz?.title}</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{lastAttempt.score}</div>
            <div className="text-sm text-gray-600 mt-1">Correct Answers</div>
          </div>
          <div className="p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{percentage.toFixed(0)}%</div>
            <div className="text-sm text-gray-600 mt-1">Score</div>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{lastAttempt.totalQuestions}</div>
            <div className="text-sm text-gray-600 mt-1">Total Questions</div>
          </div>
        </div>

        <div className="space-y-4 text-left mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Review Answers</h2>
          {quiz?.questions.map((q, idx) => {
            const userAnswer = lastAttempt.answers[q.id]
            const isCorrect = Array.isArray(q.correctAnswer)
              ? JSON.stringify((userAnswer as string[])?.sort()) === JSON.stringify(q.correctAnswer.sort())
              : typeof userAnswer === "string" &&
                userAnswer.toLowerCase().trim() === (q.correctAnswer as string).toLowerCase().trim()

            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg border-2 ${
                  isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Question {idx + 1}</span>
                  <span className={`text-sm font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                    {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                <p className="font-medium text-gray-800 mb-2">{q.question}</p>
                <div className="text-sm space-y-1">
                  <p className="text-gray-700">
                    <span className="font-semibold">Your answer:</span>{" "}
                    {Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer || "No answer"}
                  </p>
                  {!isCorrect && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Correct answer:</span>{" "}
                      {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : q.correctAnswer}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <Button onClick={onBackToLobby} className="px-8">
          Back to Quiz Lobby
        </Button>
      </Card>
    </div>
  )
}

const Profile: React.FC = () => {
  const { user } = useApp()
  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{user.score}</div>
            <div className="text-sm text-gray-600 mt-1">Total Points</div>
          </div>
          <div className="p-6 bg-green-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">{user.quizzesCompleted}</div>
            <div className="text-sm text-gray-600 mt-1">Quizzes Completed</div>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">
              {user.quizzesCompleted > 0 ? Math.round(user.score / user.quizzesCompleted) : 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Avg Score</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

const App: React.FC = () => {
  const [page, setPage] = useState<"landing" | "auth" | "lobby" | "quiz" | "results" | "profile">("landing")
  const { user, login, logout, currentQuiz } = useApp()

  useEffect(() => {
    if (currentQuiz) setPage("quiz")
  }, [currentQuiz])

  const NavBar: React.FC = () => {
    if (!user) return null
    return (
      <nav className="bg-white shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-800">QuizMaster</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setPage("lobby")}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Lobby</span>
              </button>
              <button
                onClick={() => setPage("profile")}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {page === "landing" && <Landing onGetStarted={() => setPage("auth")} />}
      {page === "auth" && (
        <Auth
          onLogin={(email, pwd) => {
            login(email, pwd)
            setPage("lobby")
          }}
        />
      )}
      {user && page !== "landing" && page !== "auth" && (
        <>
          <NavBar />
          <div className="max-w-7xl mx-auto px-4 py-8">
            {page === "lobby" && <QuizLobby />}
            {page === "quiz" && <QuizPage onComplete={() => setPage("results")} />}
            {page === "results" && <Results onBackToLobby={() => setPage("lobby")} />}
            {page === "profile" && <Profile />}
          </div>
        </>
      )}
    </div>
  )
}

export default function QuizApp() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}
