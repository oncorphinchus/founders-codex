'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth'

// CONTEXT: Home page implementing smart routing based on authentication status
export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    const handleAuth = async () => {
      await checkAuth()
      
      if (isAuthenticated) {
        router.push('/en/dashboard')
      } else {
        router.push('/en/auth/login')
      }
    }

    handleAuth()
  }, [isAuthenticated, router, checkAuth])

  // CONTEXT: Loading state with philosophical tone
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-serif text-foreground">
          The Founder's Codex
        </h1>
        <p className="text-muted-foreground">
          Loading your journey...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
} 