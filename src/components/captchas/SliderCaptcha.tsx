import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SliderCaptchaProps {
  data: {
    min: number
    max: number
    step: number
    target: number
  }
  onSolution: (solution: string) => void
}

const SliderCaptcha: React.FC<SliderCaptchaProps> = ({ data, onSolution }) => {
  const [value, setValue] = useState<number>(data.min)
  const { min, max, step, target } = data
  
  useEffect(() => {
    // Reset when we get new data
    setValue(min)
  }, [data, min])
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    setValue(newValue)
    onSolution(newValue.toString())
  }
  
  // Random noise pattern for a distraction element
  const renderNoisyPattern = () => {
    const patternSize = 12
    return (
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" className="opacity-10">
          <defs>
            <pattern
              id="noise-pattern"
              x="0"
              y="0"
              width={patternSize}
              height={patternSize}
              patternUnits="userSpaceOnUse"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <circle
                  key={i}
                  cx={Math.random() * patternSize}
                  cy={Math.random() * patternSize}
                  r={Math.random() * 2 + 1}
                  fill={`hsl(${Math.random() * 360}, 70%, 50%)`}
                />
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#noise-pattern)" />
        </svg>
      </div>
    )
  }
  
  // Distance visualization
  const getDistanceColor = () => {
    const distance = Math.abs(target - value)
    const maxDistance = (max - min) / 2
    const ratio = Math.min(1, distance / maxDistance)
    
    // Red when far, green when close
    return `hsl(${120 * (1 - ratio)}, 80%, 50%)`
  }
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold mb-2">Slider Challenge</h3>
        <p className="text-gray-700">
          Drag the slider to exactly: <span className="font-bold">{target}</span>
        </p>
      </div>
      
      <div className="relative w-full max-w-md bg-gray-100 p-6 rounded-lg mb-4">
        {renderNoisyPattern()}
        
        <div className="mb-3 text-center">
          <motion.div 
            className="text-3xl font-bold"
            animate={{ 
              color: getDistanceColor(),
              scale: [1, value === target ? 1.2 : 1, 1],
            }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.div>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            style={{
              // Custom styling for the slider track and thumb
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #d1d5db ${((value - min) / (max - min)) * 100}%, #d1d5db 100%)`,
            }}
          />
          
          {/* Generate visual noise on the slider */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-black rounded-full opacity-5"
                style={{
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        Move the slider to match the exact target value.
      </p>
    </div>
  )
}

export default SliderCaptcha