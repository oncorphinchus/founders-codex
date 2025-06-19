// CONTEXT: Type-safe interfaces matching the NestJS backend API
// These types ensure philosophical principles are enforced throughout the stack

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// CONTEXT: Goal hierarchy enforcing The Practitioner-Scholar principle
export enum GoalType {
  KEYSTONE = 'KEYSTONE',           // 10-year vision
  ANNUAL = 'ANNUAL',               // Annual objectives
  QUARTERLY = 'QUARTERLY',         // Quarterly rocks
  WEEKLY = 'WEEKLY',               // Weekly sprints
  DAILY_ATOMIC = 'DAILY_ATOMIC'    // Daily atomic tasks
}

// CONTEXT: "Language of Growth" - no negative status terminology
export enum GoalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETE = 'complete',
  LEARNING_IN_PROGRESS = 'learning_in_progress'  // Instead of "failed"
}

export interface Goal {
  id: string;
  userId: string;
  type: GoalType;
  title: string;
  description?: string;
  status: GoalStatus;
  parentId?: string;
  parent?: Goal;
  children?: Goal[];
  // CONTEXT: Hypothesis tracking for validated learning (The Practitioner-Scholar)
  isHypothesis: boolean;
  hypothesisTest?: string;
  hypothesisMetric?: string;
  learnings?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

// CONTEXT: Atomic habit formation (The 1% Better System)
export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  // CONTEXT: Habit stacking cue for behavioral design
  cue?: string;
  creationDate: string;
  updatedAt: string;
  completions?: HabitCompletion[];
  currentStreak?: number;
  completionRate?: number;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completionDate: string;
  habit?: Habit;
}

// CONTEXT: Stoic journaling for resilience (The Antifragile User)
export enum JournalType {
  STOIC_AM = 'STOIC_AM',       // Morning preparation
  STOIC_PM = 'STOIC_PM',       // Evening reflection
  GRATITUDE = 'GRATITUDE',     // Gratitude practice
  REFLECTION = 'REFLECTION'    // General reflection
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  type: JournalType;
  content: string;
  // CONTEXT: Gratitude practice for positive psychology
  gratitude1?: string;
  gratitude2?: string;
  gratitude3?: string;
  createdAt: string;
}

// CONTEXT: Decision tracking for improved judgment (The Practitioner-Scholar)
export interface DecisionLog {
  id: string;
  userId: string;
  date: string;
  decision: string;
  expectedOutcome: string;
  actualOutcome?: string;
  lessonsLearned?: string;
  emotionalState: string;
  confidenceLevel: number;  // 1-10 scale
  reviewDate?: string;
  isReviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

// CONTEXT: PERMA well-being model for integrated flourishing
export interface PermaEntry {
  id: string;
  userId: string;
  date: string;
  // CONTEXT: Martin Seligman's PERMA model scores (1-5 scale)
  positiveEmotion: number;
  engagement: number;
  relationships: number;
  meaning: number;
  accomplishment: number;
  // CONTEXT: Gratitude entries for positive emotion boost
  gratitudeEntry1?: string;
  gratitudeEntry2?: string;
  gratitudeEntry3?: string;
  dailyReflection?: string;
  createdAt: string;
}

// CONTEXT: Authentication DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// CONTEXT: API response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// CONTEXT: Error response format following "Language of Growth"
export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
} 