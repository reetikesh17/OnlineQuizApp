"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Timer, Award, CheckCircle, LogOut, Home, UserIcon, Eye, EyeOff } from "lucide-react"
import { validateCredentials } from "@/lib/auth"
import { parseCSVToQuizzes } from "@/lib/csvParser"
import LobbyScreen from "@/components/lobby/LobbyScreen"

// CSV Data
const CSV_CONTENT = `Topic,Question,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Difficulty
Computer Science Fundamentals,What does CPU stand for?,Central Processing Unit,Computer Personal Unit,Core Processing Utility,Central Program Unit,Central Processing Unit,Easy
Computer Science Fundamentals,What is the time complexity of binary search?,O(n),O(n log n),O(log n),O(1),O(log n),Medium
Computer Science Fundamentals,Which of the following is NOT a programming paradigm?,Object-Oriented,Functional,Declarative,Sequential,Sequential,Medium
Computer Science Fundamentals,Which of the following sorting algorithms is the fastest on average?,Bubble Sort,Insertion Sort,Quick Sort,Selection Sort,Quick Sort,Hard
Computer Science Fundamentals,Which protocol is used to transfer web pages?,HTTP,FTP,SMTP,TCP,HTTP,Easy
Computer Science Fundamentals,Which data structure is used for recursion?,Queue,Array,Stack,Tree,Stack,Medium
Computer Science Fundamentals,What does RAM stand for?,Random Access Memory,Read Access Module,Rapid Action Memory,Random Allocated Memory,Random Access Memory,Easy
Computer Science Fundamentals,What is the output of 5 >> 1 in binary operations?,2,3,5,10,2,Hard
Computer Science Fundamentals,What is the main function of an operating system?,Process Management,Data Storage,App Compilation,Designing UI,Process Management,Easy
Computer Science Fundamentals,Which algorithm is used in public-key encryption?,AES,RSA,MD5,SHA-1,RSA,Hard
Physics,What is the SI unit of force?,Newton,Pascal,Joule,Watt,Newton,Easy
Physics,What is the speed of light?,3x10^5 m/s,3x10^8 m/s,3x10^6 m/s,3x10^9 m/s,3x10^8 m/s,Easy
Physics,What is Ohm's Law?,V = IR,F = ma,P = IV,E = mc^2,V = IR,Medium
Physics,Which of these particles has no charge?,Electron,Proton,Neutron,Positron,Neutron,Easy
Physics,Which principle explains floating objects?,Pascal's Principle,Bernoulli's Principle,Archimedes' Principle,Newton's Law,Archimedes' Principle,Medium
Physics,Who discovered radioactivity?,Newton,Einstein,Becquerel,Curie,Becquerel,Medium
Physics,"In superconductors, resistance becomes:",Infinite,Zero,Constant,Double,Zero,Hard
Physics,What type of wave is light?,Longitudinal,Transverse,Mechanical,Standing,Transverse,Easy
Physics,What is the unit of power?,Watt,Joule,Ampere,Newton,Watt,Medium
Physics,What is Planck's constant approximately?,6.63×10⁻³⁴ Js,3×10⁸ Js,9.81 m/s²,1.6×10⁻¹⁹ C,6.63×10⁻³⁴ Js,Hard
Biology,What is the powerhouse of the cell?,Nucleus,Ribosome,Mitochondria,Golgi Apparatus,Mitochondria,Easy
Biology,Which pigment gives plants their green color?,Carotene,Xanthophyll,Chlorophyll,Anthocyanin,Chlorophyll,Easy
Biology,Which organ filters blood?,Liver,Heart,Kidney,Lungs,Kidney,Medium
Biology,DNA stands for?,Deoxyribonucleic Acid,Deoxyribose Nitrogen Acid,Deoxy Nucleic Acid,Deoxyribose Nucleotide Acid,Deoxyribonucleic Acid,Medium
Biology,What is the normal human body temperature?,37°C,36°C,38°C,35°C,37°C,Easy
Biology,What is the largest organ in the human body?,Brain,Liver,Skin,Lungs,Skin,Easy
Biology,What is photosynthesis?,Conversion of light to sugar,Breaking down sugar,Respiration,Protein synthesis,Conversion of light to sugar,Medium
Biology,Which vitamin is produced when exposed to sunlight?,Vitamin A,Vitamin B,Vitamin D,Vitamin C,Vitamin D,Medium
Biology,Which molecule carries genetic code?,RNA,DNA,Protein,Enzyme,DNA,Easy
Biology,Which scientist proposed the theory of evolution?,Newton,Darwin,Einstein,Curie,Darwin,Hard
Mechanical Engineering,What is the unit of torque?,N·m,Joule,Pascal,Watt,N·m,Easy
Mechanical Engineering,What law states pressure is inversely proportional to volume?,Boyle's Law,Charles' Law,Pascal's Law,Newton's Law,Boyle's Law,Easy
Mechanical Engineering,Function of a flywheel?,Store energy,Reduce noise,Control temperature,Measure torque,Store energy,Medium
Mechanical Engineering,Entropy is a measure of:,Order,Disorder,Heat,Energy,Disorder,Medium
Mechanical Engineering,Which cycle is used in diesel engines?,Otto Cycle,Diesel Cycle,Rankine Cycle,Carnot Cycle,Diesel Cycle,Medium
Mechanical Engineering,What is Young's modulus?,Stress/Strain,Force/Area,Power/Time,Mass/Volume,Stress/Strain,Easy
Mechanical Engineering,"In thermodynamics, the first law deals with:",Conservation of energy,Entropy,Pressure,Equilibrium,Conservation of energy,Easy
Mechanical Engineering,What is the efficiency of Carnot engine based on?,Pressure difference,Temperature difference,Volume,Mass,Temperature difference,Medium
Mechanical Engineering,What is cavitation?,Formation of vapor bubbles,Condensation,Sublimation,Compression,Formation of vapor bubbles,Hard
Mechanical Engineering,Bernoulli's theorem applies to:,Viscous fluids,Ideal fluids,Solid materials,Magnetic fields,Ideal fluids,Hard
General Knowledge,Capital of France?,Paris,London,Rome,Berlin,Paris,Easy
General Knowledge,Largest continent?,Africa,Europe,Asia,Antarctica,Asia,Easy
General Knowledge,Who invented light bulb?,Edison,Tesla,Newton,Bell,Edison,Easy
General Knowledge,The currency of Japan is:,Yen,Won,Dollar,Peso,Yen,Easy
General Knowledge,Which ocean is the largest?,Atlantic,Pacific,Indian,Arctic,Pacific,Easy
General Knowledge,Who wrote 'Hamlet'?,Shakespeare,Milton,Byron,Keats,Shakespeare,Medium
General Knowledge,First man on the moon?,Neil Armstrong,Buzz Aldrin,Yuri Gagarin,John Glenn,Neil Armstrong,Easy
General Knowledge,Which year did WW2 end?,1945,1944,1940,1950,1945,Medium
General Knowledge,The Great Wall of China was built mainly to:,Control trade,Defend against invasions,Mark borders,Reduce population,Defend against invasions,Hard
General Knowledge,Who painted 'Starry Night'?,Van Gogh,Da Vinci,Picasso,Rembrandt,Van Gogh,Hard
Programming,What does API stand for?,Application Programming Interface,Advanced Programming Index,Application Process Interface,Active Protocol Interface,Application Programming Interface,Easy
Programming,Which language is used for web development?,Python,HTML,C,Java,HTML,Easy
Programming,"In Python, '==' checks for:",Identity,Equality,Assignment,None,Equality,Easy
Programming,Which data structure uses LIFO?,Stack,Queue,Tree,Array,Stack,Medium
Programming,OOP stands for:,Object Oriented Programming,Optical Operation Process,Ordered Object Processing,Object Oriented Procedure,Object Oriented Programming,Easy
Programming,What is recursion?,Looping through data,Function calling itself,Pointer increment,Error handling,Function calling itself,Medium
Programming,SQL is used for:,Image processing,Database management,Machine learning,Web rendering,Database management,Medium
Programming,What is Big O notation used for?,Algorithm efficiency,Memory allocation,Error tracking,Debugging,Algorithm efficiency,Hard
Programming,Which of these is immutable in Python?,List,Set,Tuple,Dictionary,Tuple,Medium
Programming,What is the result of 3 + 2 * 2?,10,7,8,9,7,Easy
Android Development,What is an Activity?,UI Screen,Background Process,Layout File,Library,UI Screen,Easy
Android Development,What is an Intent?,Message for action,XML Layout,Database,Notification,Message for action,Medium
Android Development,Android apps are written in:,Java/Kotlin,Swift,C#,Python,Java/Kotlin,Easy
Android Development,What does APK stand for?,Android Package Kit,Application Key,App Package Kernel,Android Program Key,Android Package Kit,Medium
Android Development,What is RecyclerView used for?,Scrolling lists,Database,Navigation,Storage,Scrolling lists,Medium
Android Development,What file defines app permissions?,AndroidManifest.xml,MainActivity.java,build.gradle,strings.xml,AndroidManifest.xml,Easy
Android Development,Gradle is used for:,Build automation,Code debugging,UI testing,Data storage,Build automation,Medium
Android Development,Which company developed Android?,Google,Microsoft,IBM,Oracle,Google,Easy
Android Development,What is a Fragment?,UI component inside an Activity,XML tag,Database entity,Network module,UI component inside an Activity,Hard
Android Development,What layout arranges elements vertically?,LinearLayout,RelativeLayout,ConstraintLayout,FrameLayout,LinearLayout,Easy
Aptitude,"If 2x + 4 = 10, what is x?",2,3,4,6,3,Easy
Aptitude,"Next term: 2, 4, 8, 16, ?",18,20,32,24,32,Easy
Aptitude,A train 120m long crosses a pole in 10s. Speed?,10 m/s,12 m/s,14 m/s,15 m/s,12 m/s,Medium
Aptitude,"If 40% of a number is 80, find number.",120,160,200,240,200,Medium
Aptitude,Simplify: (5×6)/3,10,12,8,9,10,Easy
Aptitude,"Odd one out: Cat, Dog, Cow, Chair",Cat,Dog,Chair,Cow,Chair,Easy
Aptitude,Square root of 225?,10,12,15,20,15,Easy
Aptitude,"If 12 pens cost ₹180, cost of one pen?",₹10,₹12,₹15,₹20,₹15,Medium
Aptitude,Angle between hands at 3:15?,7.5°,30°,45°,52.5°,7.5°,Hard
Aptitude,Rearrange: RAEHT,HATER,HEART,EARTH,REATH,HEART,Medium
Movies,Who directed Inception?,Nolan,Spielberg,Cameron,Tarantino,Nolan,Easy
Movies,Who plays Iron Man?,Chris Evans,Chris Hemsworth,Robert Downey Jr.,Tom Holland,Robert Downey Jr.,Easy
Movies,Oscar Best Picture 2020?,Parasite,Joker,1917,Nomadland,Parasite,Medium
Movies,Fictional city in Black Panther?,Wakanda,Zion,Asgard,Gotham,Wakanda,Easy
Movies,First Pokémon created?,Bulbasaur,Pikachu,Mew,Rhydon,Rhydon,Hard
Movies,Voice of Elsa?,Idina Menzel,Ariana Grande,Taylor Swift,Adele,Idina Menzel,Medium
Movies,In which year was Netflix founded?,1995,1997,2001,2005,1997,Medium
Movies,Highest-grossing film?,Avatar,Avengers: Endgame,Titanic,Frozen II,Avatar,Hard
Movies,Who directed Titanic?,James Cameron,Spielberg,Nolan,Ridley Scott,James Cameron,Easy
Movies,Harry Potter's owl name?,Errol,Pigwidgeon,Hedwig,Scabbers,Hedwig,Easy
Literature,Who wrote Pride and Prejudice?,Jane Austen,Emily Bronte,George Eliot,Mary Shelley,Jane Austen,Easy
Literature,Who wrote The Raven?,Poe,Frost,Shakespeare,Wordsworth,Poe,Medium
Literature,Who wrote 1984?,Orwell,Huxley,Wells,Hemingway,Orwell,Easy
Literature,Author of The Alchemist?,Coelho,Tolstoy,Maugham,Rushdie,Coelho,Easy
Literature,What is an oxymoron?,Contradictory phrase,Comparison,Exaggeration,Symbol,Contradictory phrase,Medium
Literature,Synonym of 'benevolent'?,Kind,Cruel,Proud,Lazy,Kind,Easy
Literature,Figure of speech in 'Time is money'?,Simile,Metaphor,Alliteration,Irony,Metaphor,Medium
Literature,Who wrote The Odyssey?,Homer,Virgil,Socrates,Plato,Homer,Hard
Literature,What is the antonym of 'ancient'?,Modern,Old,Primitive,Archaic,Modern,Easy
Literature,What is the plural of 'phenomenon'?,Phenomenas,Phenomenons,Phenomena,Phenomeni,Phenomena,Medium`

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
  type: "radio"
  question: string
  options: string[]
  correctAnswer: string
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
  login: (email: string, password: string) => boolean
  logout: () => void
  quizzes: Quiz[]
  currentQuiz: Quiz | null
  startQuiz: (quizId: string) => void
  startCustomQuiz: (quiz: Quiz) => void
  submitQuiz: (answers: Record<string, string | string[]>) => QuizAttempt
  lastAttempt: QuizAttempt | null
}

const AppContext = createContext<AppContextType | null>(null)

const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}

// Quiz Data from CSV
const quizData: Quiz[] = parseCSVToQuizzes(CSV_CONTENT)

// App Provider
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<QuizAppUser | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null)

  useEffect(() => {
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
    const authUser = validateCredentials(email, password)
    
    if (authUser) {
      // Check if user data exists in localStorage
      const storedUserData = localStorage.getItem(`userData_${authUser.id}`)
      let userData = {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        score: 0,
        quizzesCompleted: 0,
      }

      if (storedUserData) {
        const parsed = JSON.parse(storedUserData)
        userData = {
          ...userData,
          score: parsed.score || 0,
          quizzesCompleted: parsed.quizzesCompleted || 0,
        }
      }

      setUser(userData)
      return true
    }
    
    return false
  }

  const logout = () => {
    setUser(null)
    setCurrentQuiz(null)
    setLastAttempt(null)
  }

  const startQuiz = (quizId: string) => {
    const quiz = quizData.find((q) => q.id === quizId)
    if (quiz) setCurrentQuiz(quiz)
  }

  const startCustomQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
  }

  const submitQuiz = (answers: Record<string, string | string[]>) => {
    if (!currentQuiz) throw new Error("No active quiz")

    let correct = 0
    currentQuiz.questions.forEach((q) => {
      const userAnswer = answers[q.id] as string
      if (userAnswer && userAnswer.trim() === q.correctAnswer.trim()) {
        correct++
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
      const updatedUser = {
        ...user,
        quizzesCompleted: user.quizzesCompleted + 1,
        score: user.score + correct * 10,
      }
      setUser(updatedUser)
      
      // Save updated user data to localStorage
      localStorage.setItem(`userData_${user.id}`, JSON.stringify({
        score: updatedUser.score,
        quizzesCompleted: updatedUser.quizzesCompleted,
      }))
    }

    return attempt
  }

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        quizzes: quizData,
        currentQuiz,
        startQuiz,
        startCustomQuiz,
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
  <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
    {/* Gradient blur glow for depth */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-purple-500/20 blur-3xl"></div>
    
    {/* Main content container */}
    <div className="relative z-10 max-w-5xl w-full text-center">
      {/* Header / Logo Section */}
      <div className="mb-16 animate-fade-in-up">
        {/* Minimal medal icon */}
        <div className="w-20 h-20 mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
          <Award className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
        
        {/* App title */}
        <h1 className="text-6xl md:text-7xl font-black mb-6 text-white tracking-tight">
          QuizMaster Pro
        </h1>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
          Challenge yourself with interactive quizzes and track your progress
        </p>
      </div>

      {/* Feature Cards Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
        {/* Timed Challenges Card */}
        <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fade-in-up animation-delay-100">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Timer className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Timed Challenges</h3>
          <p className="text-gray-600 leading-relaxed">Race against the clock</p>
        </div>

        {/* Instant Feedback Card */}
        <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fade-in-up animation-delay-200">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Feedback</h3>
          <p className="text-gray-600 leading-relaxed">See your results immediately</p>
        </div>

        {/* Track Progress Card */}
        <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fade-in-up animation-delay-300">
          <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Award className="w-8 h-8 text-purple-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Track Progress</h3>
          <p className="text-gray-600 leading-relaxed">Monitor your improvement</p>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="animate-fade-in-up animation-delay-400">
        <button
          onClick={onGetStarted}
          className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-pulse-subtle"
        >
          <span className="relative z-10">Get Started</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
        </button>
      </div>
    </div>

    {/* Footer / Branding - Circular profile icon */}
    <div className="fixed bottom-6 left-6 z-20">
      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
      </div>
    </div>

    {/* Custom CSS for animations */}
    <style jsx>{`
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse-subtle {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
        }
      }
      
      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out forwards;
      }
      
      .animate-pulse-subtle {
        animation: pulse-subtle 3s infinite;
      }
      
      .animation-delay-100 {
        animation-delay: 0.1s;
      }
      
      .animation-delay-200 {
        animation-delay: 0.2s;
      }
      
      .animation-delay-300 {
        animation-delay: 0.3s;
      }
      
      .animation-delay-400 {
        animation-delay: 0.4s;
      }
    `}</style>
  </div>
)

const Auth: React.FC<{ onLogin: (email: string, password: string) => boolean }> = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      const success = onLogin(email, password)
      if (!success) {
        setError("Invalid email or password. Access is restricted to authorized users only.")
      }
      setIsLoading(false)
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-sm text-blue-800 font-medium mb-2">Authorized Users Only</p>
          <p className="text-xs text-blue-600 text-center">
            Access is restricted to pre-approved accounts. Contact your administrator if you need access.
          </p>
        </div>
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
            const isCorrect = typeof userAnswer === "string" && userAnswer.trim() === q.correctAnswer.trim()

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
                    {userAnswer || "No answer"}
                  </p>
                  {!isCorrect && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Correct answer:</span>{" "}
                      {q.correctAnswer}
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

  const averageScore = user.quizzesCompleted > 0 ? Math.round(user.score / user.quizzesCompleted) : 0
  const hasQuizHistory = user.quizzesCompleted > 0

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
            <div className="mt-2">
              {hasQuizHistory ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active Player
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  New Player
                </span>
              )}
            </div>
          </div>
        </div>

        {hasQuizHistory ? (
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
              <div className="text-3xl font-bold text-purple-600">{averageScore}</div>
              <div className="text-sm text-gray-600 mt-1">Avg Points per Quiz</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to QuizMaster!</h3>
            <p className="text-gray-600 mb-6">
              You haven't completed any quizzes yet. Start your first quiz to see your progress here!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="font-medium text-blue-800 mb-2">Getting Started:</h4>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Browse available quizzes in the Quiz Lobby</li>
                <li>• Complete quizzes to earn points</li>
                <li>• Track your progress and improvement</li>
                <li>• Compete with other players</li>
              </ul>
            </div>
          </div>
        )}

        {hasQuizHistory && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Insights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Quiz Streak</h4>
                <p className="text-2xl font-bold text-blue-600">{user.quizzesCompleted}</p>
                <p className="text-sm text-gray-600">
                  {user.quizzesCompleted === 1 ? 'First quiz completed!' : 'Quizzes in a row'}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Performance Level</h4>
                <p className="text-2xl font-bold text-green-600">
                  {averageScore >= 80 ? 'Excellent' : averageScore >= 60 ? 'Good' : averageScore >= 40 ? 'Fair' : 'Improving'}
                </p>
                <p className="text-sm text-gray-600">
                  Based on {averageScore} avg points per quiz
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

const App: React.FC = () => {
  const [page, setPage] = useState<"landing" | "auth" | "lobby" | "lobbyroom" | "quiz" | "results" | "profile">("landing")
  const { user, login, logout, currentQuiz, startCustomQuiz } = useApp()

  useEffect(() => {
    if (currentQuiz) setPage("quiz")
  }, [currentQuiz])

  const NavBar: React.FC = () => {
    if (!user) return null
    return (
      <nav className="bg-white shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setPage("landing")}
              className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              QuizMaster
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => setPage("lobby")}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Quiz Lobby</span>
              </button>
              <button
                onClick={() => setPage("lobbyroom")}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Room Lobby</span>
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
            onClick={() => {
              logout()
              setPage("auth")
            }}
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
            const success = login(email, pwd)
            if (success) {
              setPage("lobby")
            }
            return success
          }}
        />
      )}
      {user && page !== "landing" && page !== "auth" && (
        <>
          <NavBar />
          <div className="max-w-7xl mx-auto px-4 py-8">
            {page === "lobby" && <QuizLobby />}
            {page === "lobbyroom" && user && (
              <LobbyScreen
                roomCode={`QM${Math.random().toString(36).substr(2, 4).toUpperCase()}`}
                currentUser={{
                  id: user.id,
                  username: user.name,
                  avatar: user.name.charAt(0).toUpperCase() + "👤",
                  isReady: false,
                  isHost: true,
                  isOnline: true
                }}
                isHost={true}
                onBackToLobby={() => setPage("lobby")}
                onStartQuiz={(customQuiz) => {
                  if (customQuiz) {
                    startCustomQuiz(customQuiz)
                  }
                  setPage("quiz")
                }}
              />
            )}
            {page === "quiz" && <QuizPage onComplete={() => setPage("results")} />}
            {page === "results" && <Results onBackToLobby={() => setPage("lobby")} />}
            {page === "profile" && <Profile />}
          </div>
        </>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}
