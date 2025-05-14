import { useState, useEffect, useRef, useCallback } from 'react'
import { useGameState } from '../../store/GameContext'
import { motion } from 'framer-motion'
import TextCaptcha from '../captchas/TextCaptcha'
import MathCaptcha from '../captchas/MathCaptcha'
import ImageCaptcha from '../captchas/ImageCaptcha'
import SliderCaptcha from '../captchas/SliderCaptcha'
import PatternCaptcha from '../captchas/PatternCaptcha'

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGameState()
  const [userSolution, setUserSolution] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(state.currentCaptcha?.timeLimit || 30)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    setStartTime(Date.now())
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          dispatch({ type: 'FAIL_CAPTCHA' })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [state.currentCaptcha, dispatch])
  
  const handleSolution = useCallback((solution: string) => {
    console.log('Solution received:', solution)
    setUserSolution(solution)
  }, [])
  
  const handleSubmit = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    const timeSpent = (Date.now() - startTime) / 1000
    
    dispatch({
      type: 'SOLVE_CAPTCHA',
      payload: {
        solution: userSolution,
        timeSpent
      }
    })
  }
  
  const renderCaptcha = () => {
    if (!state.currentCaptcha) return null
    
    switch (state.currentCaptcha.type) {
      case 'text':
        return <TextCaptcha data={state.currentCaptcha.data} onSolution={handleSolution} />
        
      case 'math':
        return <MathCaptcha data={state.currentCaptcha.data} onSolution={handleSolution} />
        
      case 'image':
        return <ImageCaptcha data={state.currentCaptcha.data} onSolution={handleSolution} />
        
      case 'slider':
        return <SliderCaptcha data={state.currentCaptcha.data} onSolution={handleSolution} />
        
      case 'pattern':
        return <PatternCaptcha data={state.currentCaptcha.data} onSolution={handleSolution} />
        
      default:
        return <TextCaptcha data={state.currentCaptcha.data} onSolution={handleSolution} />
    }
  }
  
  const getTimerColor = () => {
    if (timeLeft > state.currentCaptcha!.timeLimit * 0.6) return 'text-green-500'
    if (timeLeft > state.currentCaptcha!.timeLimit * 0.3) return 'text-yellow-500'
    return 'text-red-500'
  }
  
  return (
    <motion.div
      className="py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-bold">Level {state.level}</h3>
        <div className={`text-lg font-medium ${getTimerColor()}`}>
          Time: {timeLeft}s
        </div>
      </div>
      
      <div className="captcha-container mb-6">
        {renderCaptcha()}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!userSolution}
          className={`btn btn-primary px-8 py-2 ${!userSolution ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Verify
        </button>
      </div>
    </motion.div>
  )
}

export default GameBoard