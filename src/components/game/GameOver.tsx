import { useGameState } from '../../store/GameContext'
import { motion } from 'framer-motion'

const GameOver: React.FC = () => {
  const { state, dispatch } = useGameState()
  
  const handleTryAgain = () => {
    // Keep score but reset lives and level
    dispatch({
      type: 'LOAD_STATE',
      payload: {
        lives: 3,
        gameStatus: 'menu'
      }
    })
  }
  
  const handleStartOver = () => {
    dispatch({ type: 'RESET_GAME' })
    dispatch({ type: 'START_GAME' })
  }
  
  const handleBackToMenu = () => {
    dispatch({ type: 'RESET_GAME' })
  }
  
  // Check if it's game over or just level failure
  const isGameOver = state.lives <= 0
  
  if (!isGameOver) {
    return (
      <motion.div 
        className="text-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="text-5xl mb-4"
        >
          😟
        </motion.div>
        
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Wrong Answer</h2>
        
        <p className="mb-6">
          You have <span className="font-bold">{state.lives}</span> {state.lives === 1 ? 'life' : 'lives'} left. 
          Try again!
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => dispatch({ type: 'START_GAME' })}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    )
  }
  
  return (
    <motion.div 
      className="text-center py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="text-5xl mb-4"
      >
        💔
      </motion.div>
      
      <h2 className="text-2xl font-bold text-red-600 mb-2">Game Over!</h2>
      
      <div className="mb-6">
        <p className="text-lg">
          You reached <span className="font-bold">Level {state.level}</span>
        </p>
        <p className="text-xl mb-4">
          Final score: <span className="font-bold text-primary-600">{state.score}</span>
        </p>
        
        {state.history.length > 0 && (
          <div className="max-w-xs mx-auto bg-gray-50 rounded-lg p-3 mb-4">
            <h3 className="font-bold mb-2">Level History</h3>
            <div className="text-sm">
              {state.history.slice(-5).map((level, index) => (
                <div key={index} className="flex justify-between border-b border-gray-200 py-1 last:border-0">
                  <span>Level {level.level}</span>
                  <span className="font-medium">{level.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleTryAgain}
          className="btn btn-primary"
        >
          Try Again
        </button>
        
        <button
          onClick={handleStartOver}
          className="btn btn-secondary"
        >
          Start Over
        </button>
        
        <button
          onClick={handleBackToMenu}
          className="text-gray-500 underline"
        >
          Back to Menu
        </button>
      </div>
    </motion.div>
  )
}

export default GameOver