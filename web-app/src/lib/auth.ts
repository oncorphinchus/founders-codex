import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ApiClient, User } from '@founders-codex/libs'

// CONTEXT: Authentication state management following the Practitioner-Scholar principle
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (userData: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    birthDate: string; 
  }) => Promise<void>
  logout: () => void
  setLoading: (loading: boolean) => void
  checkAuth: () => Promise<void>
}

// CONTEXT: API client configured for the live production backend
const apiClient = new ApiClient()

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        try {
          set({ isLoading: true })
          
          const response = await apiClient.login(credentials)
          
          // CONTEXT: Store authentication data securely
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          })
          
        } catch (error) {
          set({ isLoading: false })
          // CONTEXT: Language of Growth - reframe errors as learning opportunities
          throw new Error('These credentials need attention. Please review and try again.')
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true })
          
          const response = await apiClient.register(userData)
          
          // CONTEXT: Automatic login after registration for smooth onboarding
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          })
          
        } catch (error) {
          set({ isLoading: false })
          throw new Error('Registration encountered an issue. Please review your information and try again.')
        }
      },

      logout: () => {
        // CONTEXT: Clean slate for fresh start - Language of Growth principle
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
        
        apiClient.clearToken()
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      checkAuth: async () => {
        if (!apiClient.isAuthenticated()) {
          set({ isAuthenticated: false })
          return
        }

        try {
          // CONTEXT: Verify token is still valid by getting current user
          const user = await apiClient.getCurrentUser()
          set({ user, isAuthenticated: true })
        } catch (error) {
          // CONTEXT: Token expired or invalid - fresh start opportunity
          set({
            user: null,
            isAuthenticated: false
          })
          apiClient.clearToken()
        }
      }
    }),
    {
      name: 'founders-codex-auth',
      // CONTEXT: Persist only non-sensitive data
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 