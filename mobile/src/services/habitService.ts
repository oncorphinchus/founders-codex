const API_BASE_URL = 'http://localhost:3000';

// CONTEXT: Type definitions for habit data structure
// Supports all features of "The 1% Better System" including streaks and completion tracking
export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  cue?: string; // For habit stacking
  creationDate: string;
  currentStreak?: number;
  longestStreak?: number;
  completionRate?: number;
  isCompletedToday?: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completionDate: string;
}

export interface CreateHabitData {
  title: string;
  description?: string;
  cue?: string;
}

// CONTEXT: Service layer for all habit-related API operations
// Provides clean abstraction for frontend components
class HabitService {
  // CONTEXT: Fetches all user habits with calculated metrics for dashboard display
  async getHabits(days: number = 90): Promise<Habit[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/habits?days=${days}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch habits: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching habits:', error);
      throw new Error('Unable to load habits. Please check your connection and try again.');
    }
  }

  // CONTEXT: Creates new atomic habit with validation for "too small to fail" principle
  async createHabit(habitData: CreateHabitData): Promise<Habit> {
    try {
      const response = await fetch(`${API_BASE_URL}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create habit');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating habit:', error);
      throw new Error('Unable to create habit. Please try again.');
    }
  }

  // CONTEXT: Core completion method - implements "Make it satisfying" feedback loop
  // Records completion for streak calculation and visual chain building
  async completeHabit(habitId: string, date?: string): Promise<HabitCompletion> {
    try {
      const body = date ? { date } : {};
      const response = await fetch(`${API_BASE_URL}/habits/${habitId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete habit');
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing habit:', error);
      
      // CONTEXT: Preserve specific error messages for UI handling
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Unable to mark habit as complete. Please try again.');
    }
  }

  // CONTEXT: Retrieves completion history for visual habit chains
  async getHabitCompletions(habitId: string, days: number = 90): Promise<HabitCompletion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/habits/${habitId}/completions?days=${days}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch completions: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching habit completions:', error);
      throw new Error('Unable to load completion history. Please try again.');
    }
  }

  async getHabit(habitId: string): Promise<Habit> {
    try {
      const response = await fetch(`${API_BASE_URL}/habits/${habitId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch habit: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching habit:', error);
      throw new Error('Unable to load habit details. Please try again.');
    }
  }

  async updateHabit(habitId: string, updateData: Partial<CreateHabitData>): Promise<Habit> {
    try {
      const response = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update habit');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating habit:', error);
      throw new Error('Unable to update habit. Please try again.');
    }
  }

  async deleteHabit(habitId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete habit: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw new Error('Unable to delete habit. Please try again.');
    }
  }
}

// CONTEXT: Export singleton instance for use throughout the app
export const habitService = new HabitService(); 