import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ImageCaptchaProps {
  data: {
    images: string[]
    prompt: string
  }
  onSolution: (solution: string) => void
}

// Mock image generation (in a real app, these would be actual images)
const generateImagePlaceholder = (id: string, isTarget = false) => {
  const colors = isTarget ? ['#3498db', '#2980b9', '#1abc9c'] : ['#e74c3c', '#c0392b', '#d35400']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  
  return (
    <div 
      className="w-full h-full rounded-lg flex items-center justify-center"
      style={{ 
        backgroundColor: randomColor,
        backgroundImage: `radial-gradient(circle, ${randomColor}88 0%, ${randomColor} 100%)`,
      }}
    >
      <div className="text-white text-xs opacity-50 text-center">
        {isTarget ? 'Target Image' : 'Placeholder'}
        <br />
        {id}
      </div>
    </div>
  )
}

const ImageCaptcha: React.FC<ImageCaptchaProps> = ({ data, onSolution }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  
  // In a real app, we'd know which image is the correct one
  // For our mock, we'll just make the first one correct
  const correctIndex = 0
  
  useEffect(() => {
    // Reset when we get new data
    setSelectedImage(null)
    onSolution('')
  }, [data, onSolution])
  
  const handleImageSelect = (index: number) => {
    setSelectedImage(index)
    onSolution(index.toString())
  }
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold mb-2">Image Challenge</h3>
        <p className="text-gray-700">
          Select the image that matches: <span className="font-bold">Fire Hydrant</span>
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-md mb-4">
        {data.images.map((img, index) => {
          // For our mock, we'll pretend the first image is always correct
          const isCorrect = index === correctIndex
          
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 
                ${selectedImage === index ? 'border-primary-500 shadow-lg' : 'border-transparent'}
              `}
              onClick={() => handleImageSelect(index)}
            >
              <div className="w-full h-full">
                {generateImagePlaceholder(img, isCorrect)}
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <p className="text-sm text-gray-500">
        Click on the image that best matches the description.
      </p>
    </div>
  )
}

export default ImageCaptcha