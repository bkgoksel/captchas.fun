import { useEffect } from 'react'
import { useGameState } from '../../store/GameContext'
import { motion } from 'framer-motion'
import { generateShareUrl } from '../../utils/storage'

const LevelSuccess: React.FC = () => {
  const { state, dispatch } = useGameState()
  const lastLevel = state.history[state.history.length - 1]
  
  useEffect(() => {
    // Auto-progress after 5 seconds
    const timer = setTimeout(() => {
      dispatch({ type: 'NEXT_LEVEL' })
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [dispatch])
  
  const handleNextLevel = () => {
    dispatch({ type: 'NEXT_LEVEL' })
  }
  
  const handleShareLevel = () => {
    const shareUrl = generateShareUrl(state.level)
    
    if (shareUrl && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert('Link copied to clipboard!')
        })
        .catch(err => {
          console.error('Failed to copy: ', err)
          // Fallback
          prompt('Copy this link to share:', shareUrl)
        })
    } else if (shareUrl) {
      // Fallback for browsers without clipboard API
      prompt('Copy this link to share:', shareUrl)
    }
  }
  
  return (
    <motion.div 
      className="text-center py-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="text-5xl mb-4"
      >
        🎉
      </motion.div>
      
      <h2 className="text-2xl font-bold text-green-600 mb-2">Level Complete!</h2>
      
      <div className="mb-6">
        <p className="text-lg">
          You solved it in <span className="font-bold">{lastLevel?.time.toFixed(1)}s</span>
        </p>
        <p className="text-xl">
          Points earned: <span className="font-bold text-primary-600">+{lastLevel?.score}</span>
        </p>
      </div>
      
      {state.unlockedTypes.length > 1 && state.level === 3 && (
        <motion.div 
          className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-bold">New CAPTCHA Type Unlocked!</p>
          <p>You can now solve Math Puzzles</p>
        </motion.div>
      )}
      
      {state.unlockedTypes.length > 2 && state.level === 5 && (
        <motion.div 
          className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-bold">New CAPTCHA Type Unlocked!</p>
          <p>You can now solve Image Selection Puzzles</p>
        </motion.div>
      )}
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleNextLevel}
          className="btn btn-primary"
        >
          Next Level
        </button>
        
        <button
          onClick={handleShareLevel}
          className="btn btn-secondary"
        >
          Share This Level
        </button>
      </div>
    </motion.div>
  )
}

export default LevelSuccess