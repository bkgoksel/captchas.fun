import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { loadGameState, saveGameState } from '../utils/storage'
import { generateCaptcha } from '../utils/captchaGenerator'

type CaptchaType = 'text' | 'image' | 'slider' | 'audio' | 'math' | 'pattern'

interface GameState {
  level: number
  score: number
  lives: number
  currentCaptcha: {
    type: CaptchaType
    data: any
    solution: string
    timeLimit: number
  } | null
  gameStatus: 'menu' | 'playing' | 'success' | 'failure' | 'gameOver'
  unlockedTypes: CaptchaType[]
  history: {
    level: number
    score: number
    time: number
  }[]
}

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'SOLVE_CAPTCHA', payload: { solution: string, timeSpent: number } }
  | { type: 'FAIL_CAPTCHA' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_STATE', payload: Partial<GameState> }

const initialState: GameState = {
  level: 1,
  score: 0,
  lives: 3,
  currentCaptcha: null,
  gameStatus: 'menu',
  unlockedTypes: ['text'],
  history: []
}

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStatus: 'playing',
        currentCaptcha: generateCaptcha(state.level, state.unlockedTypes)
      }
      
    case 'NEXT_LEVEL':
      const newLevel = state.level + 1
      const newUnlockedTypes = [...state.unlockedTypes]
      
      // Unlock new captcha types at specific levels
      if (newLevel === 3 && !newUnlockedTypes.includes('math')) {
        newUnlockedTypes.push('math')
      } else if (newLevel === 5 && !newUnlockedTypes.includes('image')) {
        newUnlockedTypes.push('image')
      } else if (newLevel === 8 && !newUnlockedTypes.includes('slider')) {
        newUnlockedTypes.push('slider')
      } else if (newLevel === 12 && !newUnlockedTypes.includes('pattern')) {
        newUnlockedTypes.push('pattern')
      }
      
      return {
        ...state,
        level: newLevel,
        unlockedTypes: newUnlockedTypes,
        currentCaptcha: generateCaptcha(newLevel, newUnlockedTypes),
        gameStatus: 'playing'
      }
      
    case 'SOLVE_CAPTCHA':
      const { solution, timeSpent } = action.payload
      const currentSolution = state.currentCaptcha?.solution
      
      if (solution === currentSolution) {
        // Calculate score based on difficulty and time
        const timeBonus = Math.max(0, 1 - (timeSpent / (state.currentCaptcha?.timeLimit || 30)))
        const difficultyMultiplier = Math.sqrt(state.level)
        const levelScore = Math.floor(100 * difficultyMultiplier * (1 + timeBonus))
        
        return {
          ...state,
          score: state.score + levelScore,
          gameStatus: 'success',
          history: [
            ...state.history,
            { level: state.level, score: levelScore, time: timeSpent }
          ]
        }
      } else {
        return {
          ...state,
          lives: state.lives - 1,
          gameStatus: state.lives > 1 ? 'failure' : 'gameOver'
        }
      }
      
    case 'FAIL_CAPTCHA':
      const newLives = state.lives - 1
      return {
        ...state,
        lives: newLives,
        gameStatus: newLives <= 0 ? 'gameOver' : 'failure'
      }
      
    case 'RESET_GAME':
      return {
        ...initialState,
        history: [...state.history]
      }
      
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload
      }
      
    default:
      return state
  }
}

interface GameContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  
  useEffect(() => {
    const savedState = loadGameState()
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState })
    }
  }, [])
  
  useEffect(() => {
    saveGameState(state)
  }, [state])
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGameState = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider')
  }
  return context
}

export default GameContext