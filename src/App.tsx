import { useState, useEffect } from 'react'
import GameContainer from './components/game/GameContainer'
import { GameProvider } from './store/GameContext'
import { loadGameState } from './utils/storage'
import './styles/index.css'

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-blue-600 font-bold animate-pulse">
          Loading CAPTCHA Challenge...
        </div>
      </div>
    )
  }

  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-100 p-4">
        <GameContainer />
      </div>
    </GameProvider>
  )
}

export default App