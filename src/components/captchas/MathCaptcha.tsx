import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MathCaptchaProps {
  data: {
    problem: string
  }
  onSolution: (solution: string) => void
}

const MathCaptcha: React.FC<MathCaptchaProps> = ({ data, onSolution }) => {
  const [userInput, setUserInput] = useState('')
  
  useEffect(() => {
    // Reset when we get new data
    setUserInput('')
  }, [data])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and minus sign
    const value = e.target.value.replace(/[^0-9-]/g, '')
    setUserInput(value)
    onSolution(value)
  }
  
  // Apply visual distortions to make the problem harder to read
  const renderDistortedProblem = () => {
    // Split the problem string into parts: numbers and operators
    const parts = data.problem.split(/([+\-*/^()])/).filter(Boolean)
    
    return parts.map((part, index) => {
      const isOperator = /[+\-*/^()]/.test(part)
      const color = isOperator 
        ? `hsl(${Math.random() * 60 + 300}, 70%, 50%)` 
        : `hsl(${Math.random() * 60 + 180}, 70%, 50%)`
      
      const rotation = Math.random() * 10 - 5
      
      return (
        <motion.span
          key={index}
          className="inline-block"
          style={{
            fontFamily: isOperator ? 'monospace' : 'serif',
            fontWeight: isOperator ? 'normal' : 'bold',
            color: color,
            margin: '0 1px',
            fontSize: isOperator ? '1.3em' : '1.2em',
          }}
          animate={{
            rotate: [rotation, -rotation, rotation],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut'
          }}
        >
          {part}
        </motion.span>
      )
    })
  }
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative">
        <div className="mb-4 p-6 bg-gray-100 rounded-lg overflow-hidden">
          {/* Random background pattern */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 40 + 10}px`,
                  height: `${Math.random() * 40 + 10}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  backgroundColor: `hsl(${Math.random() * 60 + 180}, 70%, 50%)`,
                  opacity: 0.2
                }}
              />
            ))}
            
            {/* Add some math symbols in the background */}
            {['+', '-', '×', '÷', '=', '±', '∞', '≠', '≈'].map((symbol, i) => (
              <div 
                key={`symbol-${i}`}
                className="absolute font-bold opacity-10"
                style={{
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                  fontSize: `${Math.random() * 20 + 15}px`,
                  transform: `rotate(${Math.random() * 90 - 45}deg)`,
                  color: `hsl(${Math.random() * 360}, 70%, 40%)`
                }}
              >
                {symbol}
              </div>
            ))}
          </div>
          
          <div className="relative text-2xl font-bold tracking-wider flex justify-center items-center">
            {renderDistortedProblem()}
            <span className="ml-2">=</span>
            <span className="ml-2">?</span>
          </div>
        </div>
      </div>
      
      <div className="mb-2 w-full">
        <label className="block text-gray-700 mb-1">Solve the math problem:</label>
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Enter your answer"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          autoComplete="off"
          inputMode="numeric"
        />
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Enter your answer as an integer (whole number).</p>
        <p>Use standard order of operations (PEMDAS).</p>
      </div>
    </div>
  )
}

export default MathCaptcha