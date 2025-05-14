import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface PatternCaptchaProps {
  data: {
    sequence: number[]
  }
  onSolution: (solution: string) => void
}

const PatternCaptcha: React.FC<PatternCaptchaProps> = ({ data, onSolution }) => {
  const [userInput, setUserInput] = useState('')
  const { sequence } = data
  
  useEffect(() => {
    // Reset when we get new data
    setUserInput('')
  }, [data])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9-]/g, '')
    setUserInput(value)
    onSolution(value)
  }
  
  // Render a single number in the sequence with animation and visual styling
  const renderSequenceItem = (number: number, index: number) => {
    return (
      <motion.div
        key={index}
        className="rounded-lg border-2 border-gray-200 p-3 md:p-4 flex items-center justify-center bg-white shadow-sm"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 10 }}
      >
        <span 
          className="text-xl md:text-2xl font-bold"
          style={{ 
            color: `hsl(${(number * 30) % 360}, 70%, 45%)` 
          }}
        >
          {number}
        </span>
      </motion.div>
    )
  }
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold mb-2">Pattern Challenge</h3>
        <p className="text-gray-700">
          What number comes next in this sequence?
        </p>
      </div>
      
      <div className="relative w-full max-w-md mb-6">
        <div className="flex justify-center space-x-2 md:space-x-4 mb-4">
          {sequence.map((num, index) => renderSequenceItem(num, index))}
          
          <motion.div
            className="rounded-lg border-2 border-gray-200 p-3 md:p-4 flex items-center justify-center bg-gray-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: sequence.length * 0.1, type: 'spring', stiffness: 200, damping: 10 }}
          >
            <span className="text-xl md:text-2xl font-bold text-gray-400">?</span>
          </motion.div>
        </div>
        
        {/* Visual clues/distractions */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {sequence.map((_, index) => (
            <motion.div
              key={`clue-${index}`}
              className="absolute opacity-5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 40 + 10}px`,
                height: `${Math.random() * 40 + 10}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '4px',
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
              }}
              animate={{
                opacity: [0.05, 0.1, 0.05],
                scale: [1, 1.1, 1],
                rotate: [0, Math.random() * 10 - 5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="mb-2 w-full max-w-xs">
        <label className="block text-gray-700 mb-1">Your answer:</label>
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Enter the next number"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          autoComplete="off"
          inputMode="numeric"
        />
      </div>
      
      <motion.div 
        className="text-sm text-gray-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Find the pattern and determine the next number in the sequence.</p>
        <p className="text-xs mt-1">Look for arithmetic, geometric, or other mathematical patterns.</p>
      </motion.div>
    </div>
  )
}

export default PatternCaptcha