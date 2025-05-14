import { useState } from 'react'
import { useGameState } from '../../store/GameContext'
import { motion } from 'framer-motion'

interface GameMenuProps {
  sharedLevel?: number | null
}

const GameMenu: React.FC<GameMenuProps> = ({ sharedLevel }) => {
  const { state, dispatch } = useGameState()
  const [showInfo, setShowInfo] = useState(false)
  
  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' })
  }
  
  const handleStartSharedLevel = () => {
    if (sharedLevel) {
      dispatch({ 
        type: 'LOAD_STATE', 
        payload: { 
          level: sharedLevel,
          gameStatus: 'menu'
        } 
      })
      dispatch({ type: 'START_GAME' })
    }
  }
  
  const handleToggleInfo = () => {
    setShowInfo(!showInfo)
  }
  
  return (
    <motion.div 
      className="text-center py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6">Welcome to CAPTCHA Challenge!</h2>
      
      {showInfo ? (
        <motion.div 
          className="mb-8 text-left p-4 bg-gray-50 rounded-lg max-w-md mx-auto"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-bold text-lg mb-2">How to Play</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Solve increasingly difficult CAPTCHA puzzles</li>
            <li>You have 3 lives to start with</li>
            <li>The faster you solve, the higher your score!</li>
            <li>New CAPTCHA types unlock as you progress</li>
            <li>Share your favorite levels with friends</li>
          </ul>
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">CAPTCHA Types</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 p-2 rounded">Text Recognition</div>
              <div className="bg-gray-100 p-2 rounded">Math Problems</div>
              <div className="bg-gray-100 p-2 rounded">Image Selection</div>
              <div className="bg-gray-100 p-2 rounded">Slider Puzzles</div>
              <div className="bg-gray-100 p-2 rounded">Pattern Recognition</div>
            </div>
          </div>
          <button
            onClick={handleToggleInfo}
            className="mt-4 btn btn-secondary"
          >
            Hide Info
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg mb-8">
            Can you solve progressively challenging CAPTCHA puzzles?
          </p>
          <button
            onClick={handleToggleInfo}
            className="mb-8 btn btn-secondary"
          >
            How to Play
          </button>
        </motion.div>
      )}
      
      {state.score > 0 && (
        <div className="mb-6">
          <p className="text-lg mb-2">Your current score: <span className="font-bold">{state.score}</span></p>
          <p className="text-md">You've reached level <span className="font-bold">{state.level}</span></p>
        </div>
      )}
      
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleStartGame}
          className="btn btn-primary text-lg px-8 py-3"
        >
          {state.score > 0 ? 'Continue Game' : 'Start Game'}
        </button>
        
        {sharedLevel && (
          <button
            onClick={handleStartSharedLevel}
            className="btn btn-secondary"
          >
            Start Shared Level ({sharedLevel})
          </button>
        )}
        
        {state.score > 0 && (
          <button
            onClick={() => dispatch({ type: 'RESET_GAME' })}
            className="text-gray-500 underline"
          >
            Reset Game
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default GameMenu