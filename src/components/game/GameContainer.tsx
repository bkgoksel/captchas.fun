import { useState, useEffect } from 'react'
import { useGameState } from '../../store/GameContext'
import GameMenu from './GameMenu'
import GameBoard from './GameBoard'
import GameOver from './GameOver'
import LevelSuccess from './LevelSuccess'
import { parseLevelFromUrl } from '../../utils/storage'
import { motion } from 'framer-motion'

const GameContainer: React.FC = () => {
  const { state, dispatch } = useGameState()
  const [sharedLevel, setSharedLevel] = useState<number | null>(null)
  
  useEffect(() => {
    // Check if we have a level from URL
    const levelFromUrl = parseLevelFromUrl()
    if (levelFromUrl) {
      setSharedLevel(levelFromUrl)
    }
  }, [])
  
  const renderGameState = () => {
    switch (state.gameStatus) {
      case 'menu':
        return <GameMenu sharedLevel={sharedLevel} />
        
      case 'playing':
        return <GameBoard />
        
      case 'success':
        return <LevelSuccess />
        
      case 'failure':
      case 'gameOver':
        return <GameOver />
        
      default:
        return <GameMenu sharedLevel={sharedLevel} />
    }
  }
  
  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="text-center mb-8 pt-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">CAPTCHA Challenge</h1>
        <p className="text-gray-600">Test your skills with increasingly difficult CAPTCHAs!</p>
      </header>
      
      <div className="bg-gray-200 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-lg font-medium mr-2">Level:</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
              {state.level}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-lg font-medium mr-2">Score:</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
              {state.score}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-lg font-medium mr-2">Lives:</span>
            <div className="flex">
              {Array.from({ length: state.lives }).map((_, i) => (
                <motion.div 
                  key={i} 
                  className="text-red-500 mx-0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  ❤️
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {renderGameState()}
      </div>
      
      <footer className="text-center text-gray-500 text-sm">
        <p>Created for fun & practice. All CAPTCHAs are generated on your device.</p>
      </footer>
    </motion.div>
  )
}

export default GameContainer