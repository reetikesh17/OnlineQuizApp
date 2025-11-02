// CSV Parser utility for quiz questions
export interface CSVQuizQuestion {
  topic: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  difficulty: string
}

export interface ParsedQuiz {
  id: string
  title: string
  description: string
  duration: number
  questions: Array<{
    id: string
    type: "radio"
    question: string
    options: string[]
    correctAnswer: string
  }>
  category: string
}

/**
 * Parses CSV content and converts it to quiz format
 * @param csvContent - Raw CSV content as string
 * @returns Array of parsed quizzes grouped by topic
 */
export function parseCSVToQuizzes(csvContent: string): ParsedQuiz[] {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',')
  
  // Parse CSV rows
  const questions: CSVQuizQuestion[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length >= 8) {
      questions.push({
        topic: values[0],
        question: values[1],
        optionA: values[2],
        optionB: values[3],
        optionC: values[4],
        optionD: values[5],
        correctAnswer: values[6],
        difficulty: values[7]
      })
    }
  }

  // Group questions by topic
  const topicGroups = new Map<string, CSVQuizQuestion[]>()
  
  questions.forEach(q => {
    if (!topicGroups.has(q.topic)) {
      topicGroups.set(q.topic, [])
    }
    topicGroups.get(q.topic)!.push(q)
  })

  // Convert to quiz format
  const quizzes: ParsedQuiz[] = []
  let quizId = 1

  topicGroups.forEach((topicQuestions, topic) => {
    const quiz: ParsedQuiz = {
      id: quizId.toString(),
      title: topic,
      description: `Test your knowledge in ${topic}`,
      duration: Math.max(180, topicQuestions.length * 30), // 30 seconds per question, minimum 3 minutes
      category: getCategoryFromTopic(topic),
      questions: topicQuestions.map((q, index) => ({
        id: `q${index + 1}`,
        type: "radio" as const,
        question: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer: q.correctAnswer
      }))
    }
    
    quizzes.push(quiz)
    quizId++
  })

  return quizzes
}

/**
 * Parses a single CSV line, handling commas within quoted fields
 * @param line - CSV line to parse
 * @returns Array of field values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

/**
 * Maps topic names to broader categories
 * @param topic - Topic name from CSV
 * @returns Category string
 */
function getCategoryFromTopic(topic: string): string {
  const categoryMap: Record<string, string> = {
    'Computer Science Fundamentals': 'Technology',
    'Physics': 'Science',
    'Biology': 'Science', 
    'Mechanical Engineering': 'Engineering',
    'General Knowledge': 'General',
    'Programming': 'Technology',
    'Android Development': 'Technology',
    'Aptitude': 'Mathematics',
    'Movies': 'Entertainment',
    'Literature': 'Arts & Literature'
  }
  
  return categoryMap[topic] || 'General'
}