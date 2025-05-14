// Local storage keys
const GAME_STATE_KEY = 'captcha-challenge-state'

// Load game state from local storage
export const loadGameState = () => {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY)
    if (savedState) {
      return JSON.parse(savedState)
    }
  } catch (error) {
    console.error('Failed to load game state:', error)
  }
  return null
}

// Save game state to local storage
export const saveGameState = (state: any) => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify({
      level: state.level,
      score: state.score,
      lives: state.lives,
      unlockedTypes: state.unlockedTypes,
      history: state.history
    }))
  } catch (error) {
    console.error('Failed to save game state:', error)
  }
}

// Share level via URL
export const generateShareUrl = (level: number) => {
  try {
    // Create a simple object with level info
    const levelData = {
      l: level,
      t: Date.now() // timestamp to ensure freshness
    }
    
    // Base64 encode the level data
    const encoded = btoa(JSON.stringify(levelData))
    
    return `${window.location.origin}?level=${encoded}`
  } catch (error) {
    console.error('Failed to generate share URL:', error)
    return null
  }
}

// Parse level from URL
export const parseLevelFromUrl = () => {
  try {
    const params = new URLSearchParams(window.location.search)
    const levelParam = params.get('level')
    
    if (levelParam) {
      const decoded = JSON.parse(atob(levelParam))
      
      // Verify timestamp is recent (within 7 days)
      const isValid = decoded.t && (Date.now() - decoded.t < 7 * 24 * 60 * 60 * 1000)
      
      if (isValid && decoded.l && typeof decoded.l === 'number') {
        return decoded.l
      }
    }
  } catch (error) {
    console.error('Failed to parse level from URL:', error)
  }
  
  return null
}