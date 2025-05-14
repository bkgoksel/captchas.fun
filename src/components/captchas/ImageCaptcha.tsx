import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Import fire hydrant captcha images
import fireHydrantImg from '../../assets/images/fire_hydrant_captcha/fire_hydrant.png'
import carImg from '../../assets/images/fire_hydrant_captcha/car.png'
import lampImg from '../../assets/images/fire_hydrant_captcha/lamp.png'
import manImg from '../../assets/images/fire_hydrant_captcha/man.png'
import nutImg from '../../assets/images/fire_hydrant_captcha/nut.png'
import stickImg from '../../assets/images/fire_hydrant_captcha/stick.png'
import treeImg from '../../assets/images/fire_hydrant_captcha/tree.png'
import weirdImg from '../../assets/images/fire_hydrant_captcha/weird.png'
import abstractImg from '../../assets/images/fire_hydrant_captcha/abstract.png'

interface ImageCaptchaProps {
  data: {
    images: string[]
    prompt: string
  }
  onSolution: (solution: string) => void
}

// Map of image IDs to their actual image sources
const imageMap: Record<string, string> = {
  'fire_hydrant': fireHydrantImg,
  'car': carImg,
  'lamp': lampImg,
  'man': manImg,
  'nut': nutImg,
  'stick': stickImg,
  'tree': treeImg,
  'weird': weirdImg,
  'abstract': abstractImg
}

const ImageCaptcha: React.FC<ImageCaptchaProps> = ({ data, onSolution }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const selectedImageRef = useRef<number | null>(null)
  
  // Find the index of 'fire_hydrant' in the images array
  // This is just for UI display, the actual solution is handled by GameContext
  
  // Reset selection when captcha data changes
  useEffect(() => {
    setSelectedImage(null)
    selectedImageRef.current = null
    onSolution('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  
  // Use an effect to sync the selected image from ref to state
  useEffect(() => {
    // If the state doesn't match the ref, update it
    if (selectedImage !== selectedImageRef.current && selectedImageRef.current !== null) {
      setSelectedImage(selectedImageRef.current)
    }
  })
  
  const handleImageSelect = (index: number) => {
    console.log('Image selected:', index)
    // Store in ref to persist through re-renders
    selectedImageRef.current = index
    setSelectedImage(index)
    onSolution(index.toString())
  }
  
  // Prevent click events from bubbling up
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="flex flex-col items-center p-4" onClick={handleContainerClick}>
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold mb-2">Image Challenge</h3>
        <p className="text-gray-700">
          Select the image that matches: <span className="font-bold">{data.prompt}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-3 w-full max-w-lg mx-auto mb-4">
        {data.images.map((img, index) => {
          // For display purposes only
          const isCorrect = img === 'fire_hydrant'
          
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 
                ${selectedImage === index ? 'border-blue-500 shadow-lg ring-4 ring-blue-300' : 'border-transparent'}
              `}
              onClick={() => handleImageSelect(index)}
            >
              <div className="w-full h-full relative">
                <img 
                  src={imageMap[img] || abstractImg} 
                  alt={img}
                  className="w-full h-full object-cover rounded-lg"
                />
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-30 rounded-lg flex items-center justify-center">
                    <div className="bg-white rounded-full p-1 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
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