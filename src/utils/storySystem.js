// Story Mode Adventures System

export const STORY_CHAPTERS = {
  chapter1: {
    id: 'chapter1',
    title: 'The Coin Kingdom',
    description: 'Help Princess Penny save the Coin Kingdom from the Debt Dragon!',
    emoji: '👑',
    unlocked: true,
    scenes: [
      {
        id: 'scene1',
        title: 'The Royal Problem',
        text: 'Princess Penny discovers the kingdom\'s treasure is missing! The Debt Dragon has stolen all the coins. Will you help her get them back?',
        choices: [
          { text: 'Yes, let\'s save the kingdom!', next: 'scene2', coins: 5 },
          { text: 'Maybe someone else can help?', next: 'scene1b', coins: 0 }
        ],
        character: '👸',
        background: '🏰'
      },
      {
        id: 'scene1b',
        title: 'Second Thoughts',
        text: 'Princess Penny looks sad. "I really need your help. You\'re the smartest kid I know!"',
        choices: [
          { text: 'Okay, I\'ll help you!', next: 'scene2', coins: 3 }
        ],
        character: '👸',
        background: '🏰'
      },
      {
        id: 'scene2',
        title: 'The First Challenge',
        text: 'The Bridge Keeper blocks your path: "A merchant starts with 15 gold coins. She buys bread for 4 coins, gives 3 coins to charity, and earns 2 coins from selling apples. How many coins does she have now?"',
        choices: [
          { text: '8 coins', next: 'scene2b', coins: 0 },
          { text: '10 coins', next: 'scene3', coins: 10, correct: true },
          { text: '12 coins', next: 'scene2b', coins: 0 },
          { text: '16 coins', next: 'scene2b', coins: 0 }
        ],
        character: '🧙‍♂️',
        background: '🌉'
      },
      {
        id: 'scene2b',
        title: 'Try Again',
        text: 'The Bridge Keeper frowns. "Wrong! Remember: Start with what you have, subtract what you spend and give away, then add what you earn. Try again!"',
        choices: [
          { text: 'Let me try again', next: 'scene2', coins: 0 }
        ],
        character: '🧙‍♂️',
        background: '🌉'
      },
      {
        id: 'scene3',
        title: 'Victory!',
        text: 'Excellent! You\'ve defeated the Debt Dragon and saved the Coin Kingdom! Princess Penny rewards you with royal coins.',
        choices: [
          { text: 'Continue to Chapter 2', next: 'complete', coins: 20 }
        ],
        character: '👸',
        background: '🏆'
      }
    ]
  },
  
  chapter2: {
    id: 'chapter2',
    title: 'The Shopping Spree',
    description: 'Join Captain Cash on a mission to teach the Spending Sprites about smart shopping!',
    emoji: '🛒',
    unlocked: false,
    unlockRequirement: { chapter: 'chapter1', coins: 50 },
    scenes: [
      {
        id: 'scene1',
        title: 'The Marketplace Mystery',
        text: 'Captain Cash needs your help! The Spending Sprites are buying everything they see. Can you teach them about needs vs wants?',
        choices: [
          { text: 'Let\'s teach them!', next: 'scene2', coins: 5 },
          { text: 'This sounds hard...', next: 'scene1b', coins: 0 }
        ],
        character: '🦸‍♂️',
        background: '🏪'
      },
      {
        id: 'scene2',
        title: 'The Choice Challenge',
        text: 'A Spending Sprite has $20 for school supplies. Available: fancy pencils ($8), required textbook ($12), fun stickers ($3), calculator ($15). They can only afford two items. What\'s the smartest choice?',
        choices: [
          { text: 'Textbook + stickers ($15)', next: 'scene3', coins: 15, correct: true },
          { text: 'Fancy pencils + stickers ($11)', next: 'scene2b', coins: 0 },
          { text: 'Calculator + stickers ($18)', next: 'scene2b', coins: 0 },
          { text: 'Just the calculator ($15)', next: 'scene2b', coins: 0 }
        ],
        character: '🧚‍♀️',
        background: '🏪'
      },
      {
        id: 'scene3',
        title: 'Smart Shopping Success!',
        text: 'Great choice! You\'ve taught the Spending Sprites to prioritize needs over wants. The marketplace is now balanced!',
        choices: [
          { text: 'Continue to Chapter 3', next: 'complete', coins: 25 }
        ],
        character: '🦸‍♂️',
        background: '🎉'
      }
    ]
  },
  
  chapter3: {
    id: 'chapter3',
    title: 'The Savings Safari',
    description: 'Explore the jungle with Saver Sam to find the legendary Compound Interest Tree!',
    emoji: '🌳',
    unlocked: false,
    unlockRequirement: { chapter: 'chapter2', coins: 100 },
    scenes: [
      {
        id: 'scene1',
        title: 'Into the Jungle',
        text: 'Saver Sam has found clues about a magical tree that grows money over time. But first, you must understand how savings grow!',
        choices: [
          { text: 'Let\'s learn about savings!', next: 'scene2', coins: 5 }
        ],
        character: '🧭',
        background: '🌴'
      },
      {
        id: 'scene2',
        title: 'The Growth Question',
        text: 'Saver Sam explains: "You start with $50. Each month, you add $10 and the account grows by 10% of the total. After 2 months, how much do you have?" (Calculate month by month)',
        choices: [
          { text: '$70', next: 'scene2b', coins: 0 },
          { text: '$76', next: 'scene3', coins: 20, correct: true },
          { text: '$80', next: 'scene2b', coins: 0 },
          { text: '$66', next: 'scene2b', coins: 0 }
        ],
        character: '🧭',
        background: '🌳'
      },
      {
        id: 'scene3',
        title: 'The Compound Interest Tree!',
        text: 'Amazing! You\'ve found the Compound Interest Tree! Your understanding of savings has unlocked its magic. Your money will grow over time!',
        choices: [
          { text: 'Collect the treasure!', next: 'complete', coins: 50 }
        ],
        character: '🧭',
        background: '💎'
      }
    ]
  }
}

export const getUserProgress = (kidId) => {
  try {
    if (!kidId) return { completedChapters: [], currentScene: null }
    const key = `story_progress_${kidId}`
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : { completedChapters: [], currentScene: null }
  } catch (error) {
    console.error('Error getting user progress:', error)
    return { completedChapters: [], currentScene: null }
  }
}

export const saveProgress = (kidId, chapterId, sceneId) => {
  try {
    if (!kidId || !chapterId || !sceneId) {
      throw new Error('Missing required parameters')
    }
    const progress = getUserProgress(kidId)
    progress.currentScene = { chapterId, sceneId }
    
    const key = `story_progress_${kidId}`
    localStorage.setItem(key, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving progress:', error)
    throw error
  }
}

export const completeChapter = (kidId, chapterId) => {
  try {
    if (!kidId || !chapterId) {
      throw new Error('Missing required parameters')
    }
    const progress = getUserProgress(kidId)
    if (!progress.completedChapters.includes(chapterId)) {
      progress.completedChapters.push(chapterId)
    }
    progress.currentScene = null
    
    const key = `story_progress_${kidId}`
    localStorage.setItem(key, JSON.stringify(progress))
  } catch (error) {
    console.error('Error completing chapter:', error)
    throw error
  }
}

export const isChapterUnlocked = (kidId, chapterId, userCoins) => {
  const chapter = STORY_CHAPTERS[chapterId]
  if (chapter.unlocked) return true
  
  if (chapter.unlockRequirement) {
    const progress = getUserProgress(kidId)
    const hasRequiredChapter = progress.completedChapters.includes(chapter.unlockRequirement.chapter)
    const hasRequiredCoins = userCoins >= chapter.unlockRequirement.coins
    return hasRequiredChapter && hasRequiredCoins
  }
  
  return false
}

export const getAvailableChapters = (kidId, userCoins) => {
  return Object.values(STORY_CHAPTERS).map(chapter => ({
    ...chapter,
    isUnlocked: isChapterUnlocked(kidId, chapter.id, userCoins),
    isCompleted: getUserProgress(kidId).completedChapters.includes(chapter.id)
  }))
}

export const getCurrentScene = (kidId) => {
  try {
    if (!kidId) return null
    const progress = getUserProgress(kidId)
    if (!progress || !progress.currentScene) return null
    
    const { chapterId, sceneId } = progress.currentScene
    if (!chapterId || !sceneId) return null
    
    const chapter = STORY_CHAPTERS[chapterId]
    if (!chapter || !chapter.scenes) return null
    
    const scene = chapter.scenes.find(s => s.id === sceneId)
    return scene ? { ...scene, chapterId } : null
  } catch (error) {
    console.error('Error getting current scene:', error)
    return null
  }
}