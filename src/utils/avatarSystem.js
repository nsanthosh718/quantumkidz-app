// Avatar & Character Customization System

export const AVATAR_PARTS = {
  faces: [
    { id: 'happy', emoji: '😊', name: 'Happy', cost: 0 },
    { id: 'cool', emoji: '😎', name: 'Cool', cost: 20 },
    { id: 'wink', emoji: '😉', name: 'Wink', cost: 15 },
    { id: 'star_eyes', emoji: '🤩', name: 'Star Eyes', cost: 30 },
    { id: 'thinking', emoji: '🤔', name: 'Thinking', cost: 25 },
    { id: 'genius', emoji: '🧠', name: 'Genius', cost: 50 }
  ],
  
  outfits: [
    { id: 'casual', emoji: '👕', name: 'Casual', cost: 0 },
    { id: 'formal', emoji: '👔', name: 'Formal', cost: 40 },
    { id: 'superhero', emoji: '🦸', name: 'Superhero', cost: 100 },
    { id: 'scientist', emoji: '👨‍🔬', name: 'Scientist', cost: 75 },
    { id: 'artist', emoji: '👨‍🎨', name: 'Artist', cost: 60 },
    { id: 'astronaut', emoji: '👨‍🚀', name: 'Astronaut', cost: 150 }
  ],
  
  accessories: [
    { id: 'none', emoji: '', name: 'None', cost: 0 },
    { id: 'hat', emoji: '🎩', name: 'Top Hat', cost: 35 },
    { id: 'crown', emoji: '👑', name: 'Crown', cost: 80 },
    { id: 'headphones', emoji: '🎧', name: 'Headphones', cost: 45 },
    { id: 'glasses', emoji: '🤓', name: 'Smart Glasses', cost: 25 },
    { id: 'cap', emoji: '🧢', name: 'Baseball Cap', cost: 20 }
  ],
  
  pets: [
    { id: 'none', emoji: '', name: 'No Pet', cost: 0 },
    { id: 'dog', emoji: '🐕', name: 'Loyal Dog', cost: 100 },
    { id: 'cat', emoji: '🐱', name: 'Smart Cat', cost: 90 },
    { id: 'robot', emoji: '🤖', name: 'Robot Buddy', cost: 200 },
    { id: 'dragon', emoji: '🐉', name: 'Baby Dragon', cost: 300 },
    { id: 'unicorn', emoji: '🦄', name: 'Magic Unicorn', cost: 250 }
  ]
}

export const MOODS = {
  happy: { emoji: '😊', name: 'Happy', trigger: 'good_performance' },
  excited: { emoji: '🤩', name: 'Excited', trigger: 'achievement_unlock' },
  focused: { emoji: '🧐', name: 'Focused', trigger: 'playing_game' },
  proud: { emoji: '😌', name: 'Proud', trigger: 'mission_complete' },
  sleepy: { emoji: '😴', name: 'Sleepy', trigger: 'late_night' },
  motivated: { emoji: '💪', name: 'Motivated', trigger: 'streak_active' }
}

export const getDefaultAvatar = () => ({
  face: 'happy',
  outfit: 'casual',
  accessory: 'none',
  pet: 'none',
  mood: 'happy',
  name: 'My Avatar'
})

export const getUserAvatar = (kidId) => {
  const key = `avatar_${kidId}`
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : getDefaultAvatar()
}

export const saveUserAvatar = (kidId, avatar) => {
  const key = `avatar_${kidId}`
  localStorage.setItem(key, JSON.stringify(avatar))
}

export const getUnlockedItems = (kidId) => {
  const key = `unlocked_items_${kidId}`
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : ['happy', 'casual', 'none']
}

export const unlockItem = (kidId, itemId, cost) => {
  const unlockedItems = getUnlockedItems(kidId)
  if (!unlockedItems.includes(itemId)) {
    unlockedItems.push(itemId)
    const key = `unlocked_items_${kidId}`
    localStorage.setItem(key, JSON.stringify(unlockedItems))
    return true
  }
  return false
}

export const updateAvatarMood = (kidId, trigger) => {
  const avatar = getUserAvatar(kidId)
  const newMood = Object.entries(MOODS).find(([_, mood]) => mood.trigger === trigger)
  
  if (newMood) {
    avatar.mood = newMood[0]
    saveUserAvatar(kidId, avatar)
    
    // Reset mood after 5 minutes
    setTimeout(() => {
      const currentAvatar = getUserAvatar(kidId)
      currentAvatar.mood = 'happy'
      saveUserAvatar(kidId, currentAvatar)
    }, 300000)
  }
}

export const renderAvatar = (avatar, size = 'medium') => {
  const sizes = {
    small: '24px',
    medium: '48px',
    large: '72px',
    xlarge: '96px'
  }
  
  const face = AVATAR_PARTS.faces.find(f => f.id === avatar.face)?.emoji || '😊'
  const outfit = AVATAR_PARTS.outfits.find(o => o.id === avatar.outfit)?.emoji || '👕'
  const accessory = AVATAR_PARTS.accessories.find(a => a.id === avatar.accessory)?.emoji || ''
  const pet = AVATAR_PARTS.pets.find(p => p.id === avatar.pet)?.emoji || ''
  const mood = MOODS[avatar.mood]?.emoji || '😊'
  
  return {
    face: mood, // Use mood instead of base face
    outfit,
    accessory,
    pet,
    size: sizes[size]
  }
}

export const getPetGrowthLevel = (kidId) => {
  const key = `pet_growth_${kidId}`
  const growth = parseInt(localStorage.getItem(key) || '0')
  
  if (growth < 10) return { level: 1, name: 'Baby', bonus: '' }
  if (growth < 25) return { level: 2, name: 'Young', bonus: '✨' }
  if (growth < 50) return { level: 3, name: 'Adult', bonus: '⭐' }
  return { level: 4, name: 'Elder', bonus: '🌟' }
}

export const feedPet = (kidId, points = 1) => {
  const key = `pet_growth_${kidId}`
  const currentGrowth = parseInt(localStorage.getItem(key) || '0')
  localStorage.setItem(key, (currentGrowth + points).toString())
}