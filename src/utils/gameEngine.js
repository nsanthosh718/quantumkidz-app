// Multi-subject game engine for QuantumKidz

// Daily game limits - 1 game per day with 10 questions each
const DAILY_GAME_LIMITS = {
  math: 1,
  money: 1,
  english: 1,
  science: 1,
  geography: 1,
  focus: 1
}

export const getGamesByAge = (age) => {
  const games = {
    money: { name: 'Money Master', emoji: '💰', available: age >= 4 },
    english: { name: 'Word Wizard', emoji: '📚', available: age >= 5 },
    science: { name: 'Science Explorer', emoji: '🔬', available: age >= 6 },
    geography: { name: 'World Traveler', emoji: '🌍', available: age >= 7 }
  }
  
  return Object.entries(games)
    .filter(([_, game]) => game.available)
    .map(([key, game]) => ({ ...game, key }))
}

export const canPlayGame = (kidId, gameType) => {
  try {
    if (!kidId || !gameType) return false
    const today = new Date().toDateString()
    const key = `game_plays_${kidId}_${gameType}_${today}`
    const playsToday = parseInt(localStorage.getItem(key) || '0')
    return playsToday < (DAILY_GAME_LIMITS[gameType] || 2)
  } catch (error) {
    console.error('Error checking game play limit:', error)
    return false
  }
}

export const recordGamePlay = (kidId, gameType) => {
  try {
    if (!kidId || !gameType) {
      throw new Error('Kid ID and game type are required')
    }
    const today = new Date().toDateString()
    const key = `game_plays_${kidId}_${gameType}_${today}`
    const playsToday = parseInt(localStorage.getItem(key) || '0')
    localStorage.setItem(key, (playsToday + 1).toString())
  } catch (error) {
    console.error('Error recording game play:', error)
  }
}

export const getGamePlaysToday = (kidId, gameType) => {
  const today = new Date().toDateString()
  const key = `game_plays_${kidId}_${gameType}_${today}`
  return parseInt(localStorage.getItem(key) || '0')
}

export const getRemainingPlays = (kidId, gameType) => {
  const playsToday = getGamePlaysToday(kidId, gameType)
  return Math.max(0, (DAILY_GAME_LIMITS[gameType] || 2) - playsToday)
}

// Money Game Questions
export const generateMoneyQuestion = (age) => {
  const questions = {
    4: [
      { question: 'How many pennies make 5 cents?', answer: 5, options: [3, 5, 7, 10] },
      { question: 'Which coin is worth 10 cents?', answer: 'Dime', options: ['Penny', 'Nickel', 'Dime', 'Quarter'] }
    ],
    7: [
      { question: 'How much is 2 quarters + 1 dime?', answer: 60, options: [50, 60, 70, 80] },
      { question: 'If you save $5 each week, how much in 4 weeks?', answer: 20, options: [15, 20, 25, 30] }
    ],
    10: [
      { question: 'What is 15% of $40?', answer: 6, options: [4, 6, 8, 10] },
      { question: 'If you invest $100 at 5% interest for 1 year, how much do you earn?', answer: 5, options: [3, 5, 7, 10] }
    ]
  }
  
  const ageGroup = age <= 6 ? 4 : age <= 9 ? 7 : 10
  const questionSet = questions[ageGroup]
  return questionSet[Math.floor(Math.random() * questionSet.length)]
}

// English Game Questions - Expanded and Non-Repetitive
export const generateEnglishQuestion = (age) => {
  const questions = {
    5: [
      { question: 'Which word rhymes with "cat"?', answer: 'hat', options: ['dog', 'hat', 'car', 'sun'] },
      { question: 'How many letters in "HELLO"?', answer: 5, options: [4, 5, 6, 7] },
      { question: 'Which word starts with "B"?', answer: 'Ball', options: ['Apple', 'Ball', 'Cat', 'Dog'] },
      { question: 'What comes after "A" in the alphabet?', answer: 'B', options: ['C', 'B', 'D', 'Z'] },
      { question: 'Which is the longest word?', answer: 'Elephant', options: ['Cat', 'Dog', 'Elephant', 'Ant'] },
      { question: 'What sound does "M" make?', answer: 'mmm', options: ['aaa', 'mmm', 'sss', 'zzz'] },
      { question: 'Which word rhymes with "sun"?', answer: 'fun', options: ['moon', 'fun', 'star', 'sky'] },
      { question: 'How many syllables in "butterfly"?', answer: 3, options: [2, 3, 4, 5] }
    ],
    8: [
      { question: 'What is the plural of "child"?', answer: 'children', options: ['childs', 'children', 'childes', 'child'] },
      { question: 'Which is a noun?', answer: 'book', options: ['run', 'happy', 'book', 'quickly'] },
      { question: 'What is the opposite of "hot"?', answer: 'cold', options: ['warm', 'cold', 'cool', 'freezing'] },
      { question: 'Which word is a verb?', answer: 'jump', options: ['red', 'jump', 'table', 'happy'] },
      { question: 'What is the past tense of "go"?', answer: 'went', options: ['goed', 'went', 'going', 'goes'] },
      { question: 'Which sentence uses correct punctuation?', answer: 'Hello, how are you?', options: ['Hello how are you', 'Hello, how are you?', 'Hello how are you.', 'Hello; how are you'] },
      { question: 'What type of word is "quickly"?', answer: 'adverb', options: ['noun', 'verb', 'adverb', 'adjective'] },
      { question: 'Which word means the same as "big"?', answer: 'large', options: ['small', 'large', 'tiny', 'little'] }
    ],
    11: [
      { question: 'What does "biography" mean?', answer: 'life story', options: ['life story', 'book list', 'photo album', 'diary'] },
      { question: 'Which sentence is correct?', answer: 'She and I went', options: ['Me and her went', 'Her and me went', 'She and I went', 'I and she went'] },
      { question: 'What is a metaphor?', answer: 'comparing without like/as', options: ['comparing with like/as', 'comparing without like/as', 'describing sounds', 'telling time'] },
      { question: 'Which is the subject in "The dog ran fast"?', answer: 'dog', options: ['the', 'dog', 'ran', 'fast'] },
      { question: 'What does "prefix" mean?', answer: 'letters before root word', options: ['letters after root word', 'letters before root word', 'middle of word', 'whole word'] },
      { question: 'Which is an example of alliteration?', answer: 'Peter picked peppers', options: ['The sun is bright', 'Peter picked peppers', 'I am happy', 'Dogs can bark'] },
      { question: 'What is the main idea of a paragraph?', answer: 'central topic', options: ['first sentence', 'central topic', 'last word', 'longest sentence'] },
      { question: 'Which word is an adjective?', answer: 'beautiful', options: ['quickly', 'beautiful', 'running', 'yesterday'] }
    ]
  }
  
  const ageGroup = age <= 7 ? 5 : age <= 10 ? 8 : 11
  const questionSet = questions[ageGroup]
  
  // Get used questions to avoid repetition
  const usedKey = `english_used_${ageGroup}`
  const usedQuestions = JSON.parse(localStorage.getItem(usedKey) || '[]')
  
  // Filter out used questions
  const availableQuestions = questionSet.filter((_, index) => !usedQuestions.includes(index))
  
  // If all questions used, reset
  if (availableQuestions.length === 0) {
    localStorage.removeItem(usedKey)
    return questionSet[0]
  }
  
  // Pick random from available
  const randomIndex = Math.floor(Math.random() * availableQuestions.length)
  const selectedQuestion = availableQuestions[randomIndex]
  
  // Mark as used
  const originalIndex = questionSet.indexOf(selectedQuestion)
  usedQuestions.push(originalIndex)
  localStorage.setItem(usedKey, JSON.stringify(usedQuestions))
  
  return selectedQuestion
}

// Science Game Questions
export const generateScienceQuestion = (age) => {
  const questions = {
    6: [
      { question: 'What do plants need to grow?', answer: 'sunlight', options: ['darkness', 'sunlight', 'ice', 'rocks'] },
      { question: 'How many legs does a spider have?', answer: 8, options: [6, 8, 10, 12] }
    ],
    9: [
      { question: 'What gas do plants produce?', answer: 'oxygen', options: ['carbon dioxide', 'oxygen', 'nitrogen', 'helium'] },
      { question: 'What is the closest planet to the Sun?', answer: 'Mercury', options: ['Venus', 'Mercury', 'Mars', 'Earth'] }
    ],
    12: [
      { question: 'What is H2O?', answer: 'water', options: ['oxygen', 'hydrogen', 'water', 'carbon'] },
      { question: 'What force keeps us on Earth?', answer: 'gravity', options: ['magnetism', 'gravity', 'friction', 'pressure'] }
    ]
  }
  
  const ageGroup = age <= 8 ? 6 : age <= 11 ? 9 : 12
  const questionSet = questions[ageGroup]
  return questionSet[Math.floor(Math.random() * questionSet.length)]
}

// Geography Game Questions - Expanded and Non-Repetitive
export const generateGeographyQuestion = (age) => {
  const questions = {
    7: [
      { question: 'What is the capital of USA?', answer: 'Washington DC', options: ['New York', 'Washington DC', 'Los Angeles', 'Chicago'] },
      { question: 'Which continent is Egypt in?', answer: 'Africa', options: ['Asia', 'Africa', 'Europe', 'Australia'] },
      { question: 'What is the biggest country?', answer: 'Russia', options: ['China', 'Russia', 'USA', 'Canada'] },
      { question: 'Which ocean touches California?', answer: 'Pacific', options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'] },
      { question: 'What continent is Brazil in?', answer: 'South America', options: ['North America', 'South America', 'Africa', 'Asia'] },
      { question: 'Which is the smallest continent?', answer: 'Australia', options: ['Europe', 'Australia', 'Antarctica', 'Asia'] },
      { question: 'What is the capital of Canada?', answer: 'Ottawa', options: ['Toronto', 'Ottawa', 'Montreal', 'Vancouver'] },
      { question: 'Which country is shaped like a boot?', answer: 'Italy', options: ['Spain', 'Italy', 'Greece', 'France'] }
    ],
    10: [
      { question: 'What is the capital of France?', answer: 'Paris', options: ['London', 'Paris', 'Rome', 'Berlin'] },
      { question: 'Which ocean is the largest?', answer: 'Pacific', options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'] },
      { question: 'What is the longest river in the world?', answer: 'Nile', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'] },
      { question: 'Which mountain range has Mount Everest?', answer: 'Himalayas', options: ['Rockies', 'Himalayas', 'Andes', 'Alps'] },
      { question: 'What is the capital of Japan?', answer: 'Tokyo', options: ['Osaka', 'Tokyo', 'Kyoto', 'Hiroshima'] },
      { question: 'Which desert is the largest?', answer: 'Sahara', options: ['Gobi', 'Sahara', 'Mojave', 'Atacama'] },
      { question: 'What continent has the most countries?', answer: 'Africa', options: ['Asia', 'Africa', 'Europe', 'South America'] },
      { question: 'Which country has the Great Wall?', answer: 'China', options: ['Japan', 'China', 'Korea', 'Mongolia'] }
    ],
    13: [
      { question: 'What is the capital of Australia?', answer: 'Canberra', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'] },
      { question: 'Which country has the most time zones?', answer: 'Russia', options: ['USA', 'China', 'Russia', 'Canada'] },
      { question: 'What is the deepest ocean trench?', answer: 'Mariana Trench', options: ['Puerto Rico Trench', 'Mariana Trench', 'Java Trench', 'Peru-Chile Trench'] },
      { question: 'Which strait separates Europe and Africa?', answer: 'Gibraltar', options: ['Bering', 'Gibraltar', 'Hormuz', 'Malacca'] },
      { question: 'What is the capital of Brazil?', answer: 'Brasília', options: ['Rio de Janeiro', 'Brasília', 'São Paulo', 'Salvador'] },
      { question: 'Which country is both in Europe and Asia?', answer: 'Russia', options: ['Turkey', 'Russia', 'Kazakhstan', 'Georgia'] },
      { question: 'What is the highest waterfall?', answer: 'Angel Falls', options: ['Niagara Falls', 'Angel Falls', 'Victoria Falls', 'Iguazu Falls'] },
      { question: 'Which sea is the saltiest?', answer: 'Dead Sea', options: ['Red Sea', 'Dead Sea', 'Black Sea', 'Caspian Sea'] }
    ]
  }
  
  const ageGroup = age <= 9 ? 7 : age <= 12 ? 10 : 13
  const questionSet = questions[ageGroup]
  
  // Get used questions to avoid repetition
  const usedKey = `geography_used_${ageGroup}`
  const usedQuestions = JSON.parse(localStorage.getItem(usedKey) || '[]')
  
  // Filter out used questions
  const availableQuestions = questionSet.filter((_, index) => !usedQuestions.includes(index))
  
  // If all questions used, reset
  if (availableQuestions.length === 0) {
    localStorage.removeItem(usedKey)
    return questionSet[0]
  }
  
  // Pick random from available
  const randomIndex = Math.floor(Math.random() * availableQuestions.length)
  const selectedQuestion = availableQuestions[randomIndex]
  
  // Mark as used
  const originalIndex = questionSet.indexOf(selectedQuestion)
  usedQuestions.push(originalIndex)
  localStorage.setItem(usedKey, JSON.stringify(usedQuestions))
  
  return selectedQuestion
}

export const recordGameResult = (kidId, gameType, question, userAnswer, correct, timeSpent) => {
  try {
    if (!kidId || !gameType || !question) {
      throw new Error('Required parameters missing')
    }
    
    const key = `${gameType}_history_${kidId}`
    const history = JSON.parse(localStorage.getItem(key) || '[]')
    
    const result = {
      id: Date.now().toString(),
      question: question || 'Unknown question',
      userAnswer: userAnswer !== undefined ? userAnswer : null,
      correct: Boolean(correct),
      timeSpent: typeof timeSpent === 'number' ? timeSpent : 0,
      timestamp: new Date().toISOString()
    }
    
    history.push(result)
    if (history.length > 50) history.shift()
    
    localStorage.setItem(key, JSON.stringify(history))
    return result
  } catch (error) {
    console.error('Error recording game result:', error)
    return null
  }
}

export const getGameStats = (kidId, gameType) => {
  try {
    if (!kidId || !gameType) {
      return { accuracy: 0, totalQuestions: 0, avgTime: 0, streak: 0 }
    }
    
    const key = `${gameType}_history_${kidId}`
    const history = JSON.parse(localStorage.getItem(key) || '[]')
    
    if (!Array.isArray(history) || history.length === 0) {
      return { accuracy: 0, totalQuestions: 0, avgTime: 0, streak: 0 }
    }
    
    const validHistory = history.filter(r => r && typeof r === 'object')
    if (validHistory.length === 0) {
      return { accuracy: 0, totalQuestions: 0, avgTime: 0, streak: 0 }
    }
    
    const correct = validHistory.filter(r => r.correct).length
    const totalTime = validHistory.reduce((sum, r) => sum + (r.timeSpent || 0), 0)
    const avgTime = validHistory.length > 0 ? totalTime / validHistory.length : 0
    
    let streak = 0
    for (let i = validHistory.length - 1; i >= 0; i--) {
      if (validHistory[i] && validHistory[i].correct) streak++
      else break
    }
    
    return {
      accuracy: Math.round((correct / validHistory.length) * 100),
      totalQuestions: validHistory.length,
      avgTime: Math.round(avgTime / 1000),
      streak
    }
  } catch (error) {
    console.error('Error getting game stats:', error)
    return { accuracy: 0, totalQuestions: 0, avgTime: 0, streak: 0 }
  }
}