// AI-powered adaptive math engine for QuantumKidz

export const getMathLevel = (kid) => {
  try {
    if (!kid || !kid.id) {
      throw new Error('Invalid kid data provided')
    }
    const mathHistory = JSON.parse(localStorage.getItem(`math_history_${kid.id}`) || '[]')
    const recentPerformance = mathHistory.slice(-10)
  
  if (recentPerformance.length === 0) {
    return kid.age <= 6 ? 1 : kid.age <= 9 ? 2 : 3
  }
  
  const accuracy = recentPerformance.reduce((sum, result) => sum + (result.correct ? 1 : 0), 0) / recentPerformance.length
  const avgTime = recentPerformance.reduce((sum, result) => sum + result.timeSpent, 0) / recentPerformance.length
  
  let level = kid.age <= 6 ? 1 : kid.age <= 9 ? 2 : 3
  
  if (accuracy > 0.8 && avgTime < 10000) level++
  if (accuracy < 0.5 || avgTime > 30000) level--
  
    return Math.max(1, Math.min(5, level))
  } catch (error) {
    console.error('Error getting math level:', error)
    return kid?.age <= 6 ? 1 : kid?.age <= 9 ? 2 : 3
  }
}

export const generateMathProblem = (level, type = 'mixed') => {
  const problems = {
    1: () => generateBasicAddition(),
    2: () => generateSubtraction(),
    3: () => generateMultiplication(),
    4: () => generateDivision(),
    5: () => generateAdvanced()
  }
  
  // Generate multiple problems and pick one that hasn't been used recently
  const sessionKey = `math_used_${level}_${new Date().toDateString()}`
  const usedProblems = JSON.parse(localStorage.getItem(sessionKey) || '[]')
  
  let attempts = 0
  let problem
  
  do {
    problem = problems[level] ? problems[level]() : problems[1]()
    attempts++
  } while (usedProblems.includes(problem.question) && attempts < 10)
  
  // Track used problems
  usedProblems.push(problem.question)
  if (usedProblems.length > 20) usedProblems.shift() // Keep last 20
  localStorage.setItem(sessionKey, JSON.stringify(usedProblems))
  
  return problem
}

const generateBasicAddition = () => {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b,
    type: 'addition',
    level: 1
  }
}

const generateSubtraction = () => {
  const a = Math.floor(Math.random() * 20) + 10
  const b = Math.floor(Math.random() * 10) + 1
  return {
    question: `${a} - ${b} = ?`,
    answer: a - b,
    type: 'subtraction',
    level: 2
  }
}

const generateMultiplication = () => {
  const a = Math.floor(Math.random() * 12) + 1
  const b = Math.floor(Math.random() * 12) + 1
  return {
    question: `${a} × ${b} = ?`,
    answer: a * b,
    type: 'multiplication',
    level: 3
  }
}

const generateDivision = () => {
  const b = Math.floor(Math.random() * 12) + 1
  const answer = Math.floor(Math.random() * 12) + 1
  const a = b * answer
  return {
    question: `${a} ÷ ${b} = ?`,
    answer: answer,
    type: 'division',
    level: 4
  }
}

const generateAdvanced = () => {
  const operations = [
    () => {
      const a = Math.floor(Math.random() * 50) + 10
      const b = Math.floor(Math.random() * 20) + 5
      const c = Math.floor(Math.random() * 10) + 1
      return {
        question: `${a} + ${b} - ${c} = ?`,
        answer: a + b - c,
        type: 'mixed',
        level: 5
      }
    },
    () => {
      const a = Math.floor(Math.random() * 100) + 50
      const percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)]
      return {
        question: `${percent}% of ${a} = ?`,
        answer: (a * percent) / 100,
        type: 'percentage',
        level: 5
      }
    }
  ]
  
  return operations[Math.floor(Math.random() * operations.length)]()
}

export const recordMathResult = (kidId, problem, userAnswer, timeSpent) => {
  try {
    if (!kidId || !problem) {
      throw new Error('Missing required parameters')
    }
    const history = JSON.parse(localStorage.getItem(`math_history_${kidId}`) || '[]')
  const result = {
    id: Date.now().toString(),
    problem,
    userAnswer,
    correct: userAnswer === problem.answer,
    timeSpent,
    timestamp: new Date().toISOString()
  }
  
  history.push(result)
  if (history.length > 50) history.shift() // Keep last 50 results
  
    localStorage.setItem(`math_history_${kidId}`, JSON.stringify(history))
    return result
  } catch (error) {
    console.error('Error recording math result:', error)
    return { correct: false, error: true }
  }
}

export const getMathStats = (kidId) => {
  const history = JSON.parse(localStorage.getItem(`math_history_${kidId}`) || '[]')
  if (history.length === 0) return { accuracy: 0, totalProblems: 0, avgTime: 0 }
  
  const correct = history.filter(r => r.correct).length
  const avgTime = history.reduce((sum, r) => sum + r.timeSpent, 0) / history.length
  
  return {
    accuracy: Math.round((correct / history.length) * 100),
    totalProblems: history.length,
    avgTime: Math.round(avgTime / 1000),
    streak: getCurrentStreak(history)
  }
}

const getCurrentStreak = (history) => {
  let streak = 0
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].correct) {
      streak++
    } else {
      break
    }
  }
  return streak
}