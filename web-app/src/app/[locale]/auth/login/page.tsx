'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// CONTEXT: Login page embodying the Practitioner-Scholar welcome experience
export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(formData)
      // CONTEXT: Redirect to dashboard after successful authentication
      router.push('/en/dashboard')
    } catch (error) {
      // CONTEXT: Language of Growth - encouraging error messaging
      setError(error instanceof Error ? error.message : 'A learning opportunity arose. Please try again.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* CONTEXT: Philosophical branding establishing the tone */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-foreground">
            The Founder's Codex
          </h1>
          <p className="text-muted-foreground">
            Where ancient wisdom meets modern execution
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif text-center">
              Welcome Back, Practitioner-Scholar
            </CardTitle>
            <CardDescription className="text-center">
              Continue your journey toward wisdom and excellence
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* CONTEXT: Error display using encouraging language */}
              {error && (
                <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="Your secure password"
                />
              </div>
            </CardContent>

            <CardFooter className="space-y-4">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Processing wisdom...' : 'Begin Session'}
              </Button>

              {/* CONTEXT: Registration pathway will be implemented later */}
              <div className="text-center text-sm text-muted-foreground">
                New to the Codex? Registration coming soon.
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* CONTEXT: Subtle philosophical reminder */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="italic">
            "The impediment to action advances action. What stands in the way becomes the way."
          </p>
          <p className="text-xs mt-1">— Marcus Aurelius</p>
        </div>
      </div>
    </div>
  )
} 