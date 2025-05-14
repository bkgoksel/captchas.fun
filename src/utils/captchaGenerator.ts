import { v4 as uuidv4 } from 'uuid';

// Import UUID which we'll need to add to package.json later
type CaptchaType = 'text' | 'image' | 'slider' | 'audio' | 'math' | 'pattern'

interface Captcha {
  id: string
  type: CaptchaType
  data: any
  solution: string
  timeLimit: number
}

// Generate random string for text captcha
const generateRandomString = (length: number, difficulty: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const similarChars = 'OQ01lIij'
  
  let result = ''
  
  // Higher difficulty adds more similar-looking characters
  const usePool = chars + (difficulty > 3 ? similarChars.repeat(Math.floor(difficulty / 2)) : '')
  
  for (let i = 0; i < length; i++) {
    result += usePool.charAt(Math.floor(Math.random() * usePool.length))
  }
  
  return result
}

// Generate math problem based on difficulty
const generateMathProblem = (difficulty: number): { problem: string, solution: string } => {
  // Basic operations for all difficulties
  const operations = ['+', '-', '*']
  
  // For higher difficulties, add more complex operations
  if (difficulty >= 5) {
    operations.push('/', '^')
  }
  
  // Generate random numbers based on difficulty
  const maxNum = Math.min(10 + (difficulty * 5), 50)
  const num1 = Math.floor(Math.random() * maxNum) + 1
  const num2 = Math.floor(Math.random() * maxNum) + 1
  
  // For higher difficulties, add more operations
  const opCount = Math.min(Math.floor(difficulty / 3) + 1, 3)
  
  let problem = num1.toString()
  let currentValue = num1
  
  for (let i = 0; i < opCount; i++) {
    const op = operations[Math.floor(Math.random() * operations.length)]
    const nextNum = Math.floor(Math.random() * maxNum) + 1
    
    problem += ` ${op} ${nextNum}`
    
    // Calculate the next step
    switch (op) {
      case '+':
        currentValue += nextNum
        break
      case '-':
        currentValue -= nextNum
        break
      case '*':
        currentValue *= nextNum
        break
      case '/':
        // Ensure division results in an integer
        const tempNextNum = currentValue % nextNum === 0 ? nextNum : currentValue
        problem = problem.substring(0, problem.length - nextNum.toString().length) + tempNextNum
        currentValue = currentValue / tempNextNum
        break
      case '^':
        // Limit exponentiation to prevent huge numbers
        const limitedExp = Math.min(nextNum, 3)
        problem = problem.substring(0, problem.length - nextNum.toString().length) + limitedExp
        currentValue = Math.pow(currentValue, limitedExp)
        break
    }
  }
  
  return {
    problem,
    solution: Math.round(currentValue).toString()
  }
}

// Generate image selection data with real fire hydrant images
const generateImageSelection = (difficulty: number): { images: string[], correctIndex: number } => {
  // Use the actual image names from our fire_hydrant_captcha folder
  const allImages = [
    'fire_hydrant', 
    'car', 
    'lamp', 
    'man', 
    'nut', 
    'stick', 
    'tree', 
    'weird', 
    'abstract'
  ]
  
  // Fire hydrant is always the target
  const targetImage = 'fire_hydrant'
  
  // Shuffle the non-target images
  const shuffledImages = [...allImages.filter(img => img !== targetImage)]
    .sort(() => Math.random() - 0.5)
  
  // Always use 8 non-target images (total of 9 with target)
  // If we have fewer than 8 non-target images, repeat some of them
  let nonTargetImages: string[] = []
  while (nonTargetImages.length < 8) {
    nonTargetImages = nonTargetImages.concat(shuffledImages)
  }
  nonTargetImages = nonTargetImages.slice(0, 8)
  
  // Insert the target image at a random position
  const randomPosition = Math.floor(Math.random() * 9)
  const finalImages = [...nonTargetImages]
  finalImages.splice(randomPosition, 0, targetImage)
  
  return {
    images: finalImages,
    correctIndex: randomPosition
  }
}

// Generate slider puzzle data
const generateSliderPuzzle = (difficulty: number): { target: number, min: number, max: number, step: number } => {
  const min = 0
  const max = 10 * difficulty
  const step = Math.max(1, Math.floor(10 / difficulty))
  const target = Math.floor(Math.random() * (max / step)) * step + min
  
  return {
    target,
    min,
    max,
    step
  }
}

// Generate pattern recognition puzzle
const generatePatternPuzzle = (difficulty: number): { sequence: number[], answer: number } => {
  const patternTypes = ['arithmetic', 'geometric', 'fibonacci', 'alternate']
  const patternType = patternTypes[Math.floor(Math.random() * (difficulty > 6 ? patternTypes.length : 2))]
  
  let sequence: number[] = []
  let answer = 0
  
  switch (patternType) {
    case 'arithmetic':
      const diff = Math.floor(Math.random() * 5) + 1
      const start = Math.floor(Math.random() * 10) + 1
      sequence = Array(5).fill(0).map((_, i) => start + (i * diff))
      answer = start + (5 * diff)
      break
      
    case 'geometric':
      const ratio = Math.floor(Math.random() * 3) + 2
      const geoStart = Math.floor(Math.random() * 5) + 1
      sequence = Array(5).fill(0).map((_, i) => geoStart * Math.pow(ratio, i))
      answer = geoStart * Math.pow(ratio, 5)
      break
      
    case 'fibonacci':
      sequence = [1, 1]
      for (let i = 2; i < 5; i++) {
        sequence.push(sequence[i-1] + sequence[i-2])
      }
      answer = sequence[4] + sequence[3]
      break
      
    case 'alternate':
      const alt1 = Math.floor(Math.random() * 5) + 1
      const alt2 = Math.floor(Math.random() * 5) + 6
      sequence = [alt1, alt2, alt1, alt2, alt1]
      answer = alt2
      break
  }
  
  return {
    sequence,
    answer
  }
}

// Main captcha generator function
export const generateCaptcha = (level: number, availableTypes: CaptchaType[]): Captcha => {
  // Determine captcha type based on available types
  const type = availableTypes[Math.floor(Math.random() * availableTypes.length)]
  
  // Base time limit starts at 30 seconds and decreases with level
  const baseTimeLimit = Math.max(10, 30 - Math.floor(level / 3))
  
  // Adjust time based on difficulty and type
  let timeLimit = baseTimeLimit
  let data: any
  let solution: string
  
  switch (type) {
    case 'text':
      const textLength = 4 + Math.min(Math.floor(level / 2), 4)
      const captchaText = generateRandomString(textLength, level)
      data = { text: captchaText }
      solution = captchaText
      break
      
    case 'math':
      const mathProblem = generateMathProblem(level)
      data = { problem: mathProblem.problem }
      solution = mathProblem.solution
      // Math problems get a bit more time
      timeLimit += 5
      break
      
    case 'image':
      const imageSelection = generateImageSelection(level)
      data = {
        images: imageSelection.images,
        prompt: 'Fire Hydrant'
      }
      solution = imageSelection.correctIndex.toString()
      break
      
    case 'slider':
      const sliderPuzzle = generateSliderPuzzle(level)
      data = {
        min: sliderPuzzle.min,
        max: sliderPuzzle.max,
        step: sliderPuzzle.step,
        target: sliderPuzzle.target
      }
      solution = sliderPuzzle.target.toString()
      break
      
    case 'pattern':
      const patternPuzzle = generatePatternPuzzle(level)
      data = { sequence: patternPuzzle.sequence }
      solution = patternPuzzle.answer.toString()
      // Pattern puzzles get more time
      timeLimit += 10
      break
      
    default:
      // Fallback to text
      const fallbackText = generateRandomString(5, level)
      data = { text: fallbackText }
      solution = fallbackText
  }
  
  return {
    id: uuidv4(),
    type,
    data,
    solution,
    timeLimit
  }
}