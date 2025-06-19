// CONTEXT: Type-safe API client for The Founder's Codex backend
// Handles authentication and all API communication with philosophical principles

import {
  User,
  Goal,
  Habit,
  HabitCompletion,
  JournalEntry,
  DecisionLog,
  PermaEntry,
  LoginDto,
  RegisterDto,
  AuthResponse,
  ApiError,
  GoalType,
  JournalType
} from './types';

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'https://founders-codex-rgsxo.ondigitalocean.app/api') {
    this.baseUrl = baseUrl;
    // CONTEXT: Retrieve stored JWT token on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('founders_codex_token');
    }
  }

  // CONTEXT: Private method for making authenticated requests
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // CONTEXT: Attach JWT token for authenticated requests
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // CONTEXT: Handle non-2xx responses with growth-oriented error messages
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: 'Learning opportunity encountered',
          statusCode: response.status,
          timestamp: new Date().toISOString(),
          path: endpoint,
        }));
        throw new Error(errorData.message || 'An unexpected learning opportunity occurred');
      }

      return await response.json();
    } catch (error) {
      // CONTEXT: Transform network errors into growth-oriented language
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Connection challenge encountered. Please try again.');
    }
  }

  // CONTEXT: Store JWT token securely in localStorage
  private setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('founders_codex_token', token);
    }
  }

  // CONTEXT: Clear authentication token
  public clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('founders_codex_token');
    }
  }

  // CONTEXT: Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.token;
  }

  // === AUTHENTICATION ENDPOINTS ===

  // CONTEXT: User registration with growth-oriented messaging
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    return response;
  }

  // CONTEXT: User login with secure token management
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    return response;
  }

  // CONTEXT: Secure logout
  async logout(): Promise<void> {
    this.clearToken();
  }

  // === USER ENDPOINTS ===

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  // === GOAL STACK ENDPOINTS ===
  // CONTEXT: Hierarchical goal system enforcing The Practitioner-Scholar principle

  async getGoals(): Promise<Goal[]> {
    return this.request<Goal[]>('/goals');
  }

  async getGoalHierarchy(): Promise<Goal[]> {
    return this.request<Goal[]>('/goals/hierarchy');
  }

  async getGoalsByType(type: GoalType): Promise<Goal[]> {
    return this.request<Goal[]>(`/goals/by-type/${type}`);
  }

  async getTodaysGoals(): Promise<Goal[]> {
    return this.request<Goal[]>('/goals/today');
  }

  async getGoal(id: string): Promise<Goal> {
    return this.request<Goal>(`/goals/${id}`);
  }

  async createGoal(data: Partial<Goal>): Promise<Goal> {
    return this.request<Goal>('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGoal(id: string, data: Partial<Goal>): Promise<Goal> {
    return this.request<Goal>(`/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async completeGoal(id: string): Promise<Goal> {
    return this.request<Goal>(`/goals/${id}/complete`, {
      method: 'PATCH',
    });
  }

  async markGoalAsLearning(id: string, learnings: string): Promise<Goal> {
    return this.request<Goal>(`/goals/${id}/learning`, {
      method: 'PATCH',
      body: JSON.stringify({ learnings }),
    });
  }

  async deleteGoal(id: string): Promise<void> {
    return this.request<void>(`/goals/${id}`, {
      method: 'DELETE',
    });
  }

  // === HABIT ENGINE ENDPOINTS ===
  // CONTEXT: Atomic habit formation implementing The 1% Better System

  async getHabits(): Promise<Habit[]> {
    return this.request<Habit[]>('/habits');
  }

  async getHabit(id: string): Promise<Habit> {
    return this.request<Habit>(`/habits/${id}`);
  }

  async createHabit(data: Partial<Habit>): Promise<Habit> {
    return this.request<Habit>('/habits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHabit(id: string, data: Partial<Habit>): Promise<Habit> {
    return this.request<Habit>(`/habits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async completeHabit(id: string): Promise<HabitCompletion> {
    return this.request<HabitCompletion>(`/habits/${id}/complete`, {
      method: 'POST',
    });
  }

  async getHabitCompletions(id: string): Promise<HabitCompletion[]> {
    return this.request<HabitCompletion[]>(`/habits/${id}/completions`);
  }

  async deleteHabit(id: string): Promise<void> {
    return this.request<void>(`/habits/${id}`, {
      method: 'DELETE',
    });
  }

  // === RESILIENCE TOOLKIT ENDPOINTS ===
  // CONTEXT: Stoic journaling and reflection for The Antifragile User

  async getJournalEntries(): Promise<JournalEntry[]> {
    return this.request<JournalEntry[]>('/journal');
  }

  async getTodaysJournal(): Promise<JournalEntry | null> {
    return this.request<JournalEntry | null>('/journal/today');
  }

  async getJournalStreak(): Promise<{ streak: number }> {
    return this.request<{ streak: number }>('/journal/streak');
  }

  async getJournalPrompts(type: JournalType): Promise<{ prompts: string[] }> {
    return this.request<{ prompts: string[] }>(`/journal/prompts/${type}`);
  }

  async createJournalEntry(data: Partial<JournalEntry>): Promise<JournalEntry> {
    return this.request<JournalEntry>('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJournalEntry(id: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
    return this.request<JournalEntry>(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJournalEntry(id: string): Promise<void> {
    return this.request<void>(`/journal/${id}`, {
      method: 'DELETE',
    });
  }

  // === DECISION JOURNAL ENDPOINTS ===
  // CONTEXT: Decision tracking for improved judgment

  async getDecisionLogs(): Promise<DecisionLog[]> {
    return this.request<DecisionLog[]>('/decision-logs');
  }

  async getDecisionsDueForReview(): Promise<DecisionLog[]> {
    return this.request<DecisionLog[]>('/decision-logs/due-for-review');
  }

  async getDecisionAnalytics(): Promise<any> {
    return this.request<any>('/decision-logs/analytics');
  }

  async createDecisionLog(data: Partial<DecisionLog>): Promise<DecisionLog> {
    return this.request<DecisionLog>('/decision-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDecisionLog(id: string, data: Partial<DecisionLog>): Promise<DecisionLog> {
    return this.request<DecisionLog>(`/decision-logs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async reviewDecision(id: string, outcome: string, lessons: string): Promise<DecisionLog> {
    return this.request<DecisionLog>(`/decision-logs/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({
        actualOutcome: outcome,
        lessonsLearned: lessons,
        isReviewed: true,
      }),
    });
  }

  async deleteDecisionLog(id: string): Promise<void> {
    return this.request<void>(`/decision-logs/${id}`, {
      method: 'DELETE',
    });
  }

  // === WELL-BEING MONITOR ENDPOINTS ===
  // CONTEXT: PERMA model tracking for integrated flourishing

  async getPermaEntries(): Promise<PermaEntry[]> {
    return this.request<PermaEntry[]>('/perma');
  }

  async getTodaysPerma(): Promise<PermaEntry | null> {
    return this.request<PermaEntry | null>('/perma/today');
  }

  async getPermaAnalytics(): Promise<any> {
    return this.request<any>('/perma/analytics');
  }

  async createPermaEntry(data: Partial<PermaEntry>): Promise<PermaEntry> {
    return this.request<PermaEntry>('/perma/daily', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePermaEntry(id: string, data: Partial<PermaEntry>): Promise<PermaEntry> {
    return this.request<PermaEntry>(`/perma/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePermaEntry(id: string): Promise<void> {
    return this.request<void>(`/perma/${id}`, {
      method: 'DELETE',
    });
  }

  // === HEALTH CHECK ===
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

// CONTEXT: Export singleton instance for consistent usage
export const apiClient = new ApiClient(); 