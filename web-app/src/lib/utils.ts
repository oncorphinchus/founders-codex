import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// CONTEXT: Utility function for merging Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// CONTEXT: Utility functions embodying philosophical principles

/**
 * Calculate the current week number in a person's life based on their birth date
 * CONTEXT: Core function for the 90-Year View memento mori engine
 */
export function calculateLifeWeek(birthDate: Date): number {
  const now = new Date()
  const timeDiff = now.getTime() - birthDate.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))
  return Math.floor(daysDiff / 7) + 1
}

/**
 * Calculate remaining weeks until 90th birthday
 * CONTEXT: Visualization of finite time remaining for strategic focus
 */
export function calculateRemainingWeeks(birthDate: Date): number {
  const totalWeeks = 90 * 52 // 4,680 weeks in 90 years
  const currentWeek = calculateLifeWeek(birthDate)
  return Math.max(0, totalWeeks - currentWeek)
}

/**
 * Calculate age at a specific week in the 90-year grid
 * CONTEXT: Help users understand their life phases and timing
 */
export function calculateAgeAtWeek(birthDate: Date, weekNumber: number): number {
  return Math.floor(weekNumber / 52)
}

/**
 * Format a streak count with encouraging language
 * CONTEXT: Language of Growth principle - celebrating process and consistency
 */
export function formatStreak(streakDays: number): string {
  if (streakDays === 0) return "Ready to begin"
  if (streakDays === 1) return "Building momentum"
  if (streakDays < 7) return `${streakDays} days of progress`
  if (streakDays < 30) return `${streakDays} days of consistency`
  if (streakDays < 100) return `${streakDays} days of dedication`
  return `${streakDays} days of mastery`
}

/**
 * Generate encouraging messages based on completion percentage
 * CONTEXT: Language of Growth - positive reinforcement for all effort levels
 */
export function getEncouragingMessage(completionRate: number): string {
  if (completionRate >= 0.9) return "Exceptional consistency - you're mastering this"
  if (completionRate >= 0.8) return "Strong commitment - keep up the excellent work"
  if (completionRate >= 0.7) return "Solid progress - you're building something lasting"
  if (completionRate >= 0.6) return "Good momentum - each day brings improvement"
  if (completionRate >= 0.5) return "Growing stronger - progress is progress"
  if (completionRate >= 0.3) return "Finding your rhythm - stay persistent"
  if (completionRate >= 0.1) return "Every step counts - you're learning and growing"
  return "Ready for a fresh start - your potential awaits"
}

/**
 * Convert goal status to user-friendly language following "Language of Growth"
 * CONTEXT: No negative language - all states frame opportunities for growth
 */
export function formatGoalStatus(status: string): string {
  switch (status.toLowerCase()) {
    case 'not_started':
      return 'Awaiting Action'
    case 'in_progress':
      return 'Building Momentum'
    case 'complete':
      return 'Excellence Achieved'
    case 'learning_in_progress':
      return 'Learning in Progress'
    default:
      return 'Ready for Focus'
  }
}

/**
 * Generate philosophical quotes for daily wisdom
 * CONTEXT: Reinforcing the core principles through timeless wisdom
 */
export function getDailyWisdom(): { quote: string; author: string } {
  const wisdom = [
    {
      quote: "The obstacle is the way.",
      author: "Marcus Aurelius"
    },
    {
      quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius"
    },
    {
      quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb"
    },
    {
      quote: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier"
    },
    {
      quote: "The man who moves a mountain begins by carrying away small stones.",
      author: "Confucius"
    }
  ]
  
  const today = new Date().getDate()
  return wisdom[today % wisdom.length]
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - d.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'today'
  if (diffInDays === 1) return 'yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return formatDate(d)
}

export function calculateAge(birthDate: Date): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function calculateWeeksLived(birthDate: Date): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const diffInMs = today.getTime() - birth.getTime()
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7))
}

export function calculateWeeksRemaining(birthDate: Date, lifeExpectancy: number = 90): number {
  const totalWeeks = lifeExpectancy * 52
  const weeksLived = calculateWeeksLived(birthDate)
  return Math.max(0, totalWeeks - weeksLived)
} 