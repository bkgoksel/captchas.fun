import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TextCaptchaProps {
  data: {
    text: string
  }
  onSolution: (solution: string) => void
}

const TextCaptcha: React.FC<TextCaptchaProps> = ({ data, onSolution }) => {
  const [userInput, setUserInput] = useState('')
  
  useEffect(() => {
    // Reset when we get new data
    setUserInput('')
  }, [data])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserInput(value)
    onSolution(value)
  }
  
  // Apply visual distortions to make text harder to read
  const renderDistortedText = () => {
    return data.text.split('').map((char, index) => {
      const rotation = Math.random() * 30 - 15
      const fontSize = Math.random() * 0.5 + 0.8
      const isWaved = Math.random() > 0.5
      
      return (
        <motion.span
          key={index}
          className="inline-block"
          style={{
            fontFamily: index % 2 ? 'monospace' : 'serif',
            transform: `rotate(${rotation}deg) scale(${fontSize})`,
            display: 'inline-block',
            marginLeft: '1px',
            marginRight: '1px',
            color: `hsl(${Math.random() * 360}, 70%, 40%)`,
            textShadow: index % 3 === 0 ? '1px 1px 1px rgba(0,0,0,0.2)' : 'none',
            fontWeight: index % 2 === 0 ? 'bold' : 'normal'
          }}
          animate={isWaved ? {
            y: [0, -3, 0, 3, 0],
          } : {}}
          transition={isWaved ? {
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          } : {}}
        >
          {char}
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
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 50 + 10}px`,
                  height: `${Math.random() * 50 + 10}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  opacity: 0.1
                }}
              />
            ))}
            
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i + 'line'}
                className="absolute"
                style={{
                  left: 0,
                  top: `${Math.random() * 100}%`,
                  width: '100%',
                  height: `${Math.random() * 2 + 1}px`,
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  opacity: 0.2
                }}
              />
            ))}
          </div>
          
          <div className="relative text-3xl font-bold tracking-wider">
            {renderDistortedText()}
          </div>
        </div>
      </div>
      
      <div className="mb-2 w-full">
        <label className="block text-gray-700 mb-1">Type the text you see above:</label>
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Enter text"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>
      
      <p className="text-sm text-gray-500">
        Case sensitive. Enter exactly what you see.
      </p>
    </div>
  )
}

export default TextCaptcha