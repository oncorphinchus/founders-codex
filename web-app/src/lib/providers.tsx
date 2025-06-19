'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// CONTEXT: Query client setup for server state management with the Goal Stack API
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // CONTEXT: Reasonable defaults for Goal Stack interaction
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: (failureCount, error) => {
        // CONTEXT: Don't retry on authentication errors
        if (error instanceof Error && error.message.includes('401')) {
          return false
        }
        return failureCount < 3
      }
    },
    mutations: {
      // CONTEXT: Growth-oriented error handling
      retry: false
    }
  }
})

interface QueryProviderProps {
  children: React.ReactNode
}

// CONTEXT: React Query provider for managing server state throughout the app
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
} 