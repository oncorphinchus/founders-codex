import { Goal } from '../screens/GoalStackScreen';

// CONTEXT: API configuration - in a real app, this would come from environment variables
const API_BASE_URL = 'http://localhost:3000'; // Development server

interface CreateGoalData {
  type: Goal['type'];
  title: string;
  description?: string;
  parentId?: string;
  weekId?: number;
  specificMeasure?: string;
  targetDate?: string;
  isHypothesis?: boolean;
  hypothesisTest?: string;
  hypothesisMetric?: string;
}

interface UpdateGoalData {
  title?: string;
  description?: string;
  status?: Goal['status'];
  specificMeasure?: string;
  targetDate?: string;
  isHypothesis?: boolean;
  hypothesisTest?: string;
  hypothesisMetric?: string;
  learnings?: string;
}

// CONTEXT: API service that implements communication with the Goal Stack backend
// Provides type-safe methods for all goal operations with proper error handling
class GoalsApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // CONTEXT: Creates a new goal with hierarchy validation on the backend
  async createGoal(userId: string, goalData: CreateGoalData): Promise<Goal> {
    return this.makeRequest<Goal>('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
      headers: {
        'Content-Type': 'application/json',
      },
      // Note: In a real app, userId would come from authentication headers
      // Here we're passing it as a query parameter for simplicity
    });
  }

  // CONTEXT: Retrieves all goals for a user with full hierarchy
  async getAllGoals(userId: string): Promise<Goal[]> {
    return this.makeRequest<Goal[]>(`/goals?userId=${userId}`);
  }

  // CONTEXT: Gets the hierarchical tree structure for Goal Stack visualization
  async getHierarchy(userId: string): Promise<Goal[]> {
    return this.makeRequest<Goal[]>(`/goals/hierarchy?userId=${userId}`);
  }

  // CONTEXT: Retrieves goals by type for focused management
  async getGoalsByType(userId: string, type: Goal['type']): Promise<Goal[]> {
    return this.makeRequest<Goal[]>(`/goals/by-type/${type}?userId=${userId}`);
  }

  // CONTEXT: Gets today's atomic tasks for daily execution focus
  async getTodaysTasks(userId: string): Promise<Goal[]> {
    return this.makeRequest<Goal[]>(`/goals/today?userId=${userId}`);
  }

  // CONTEXT: Retrieves a specific goal with full context
  async getGoal(goalId: string, userId: string): Promise<Goal> {
    return this.makeRequest<Goal>(`/goals/${goalId}?userId=${userId}`);
  }

  // CONTEXT: Updates a goal with "Language of Growth" validation
  async updateGoal(goalId: string, userId: string, updateData: UpdateGoalData): Promise<Goal> {
    return this.makeRequest<Goal>(`/goals/${goalId}?userId=${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  // CONTEXT: Marks a goal as complete with celebration
  async markGoalComplete(goalId: string, userId: string): Promise<Goal> {
    return this.makeRequest<Goal>(`/goals/${goalId}/complete?userId=${userId}`, {
      method: 'PATCH',
    });
  }

  // CONTEXT: Transitions goal to learning mode with required insights capture
  async markGoalLearningInProgress(
    goalId: string, 
    userId: string, 
    learnings: string
  ): Promise<Goal> {
    return this.makeRequest<Goal>(`/goals/${goalId}/learning?userId=${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ learnings }),
    });
  }

  // CONTEXT: Deletes a goal with hierarchy integrity protection
  async deleteGoal(goalId: string, userId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/goals/${goalId}?userId=${userId}`, {
      method: 'DELETE',
    });
  }
}

// CONTEXT: Export singleton instance for consistent API access across the app
export const goalsApi = new GoalsApiService(); 