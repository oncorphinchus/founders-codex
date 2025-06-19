'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LifeGrid } from '@/components/LifeGrid'
import { GoalTree } from '@/components/GoalTree'
import { CreateGoalModal } from '@/components/CreateGoalModal'

// CONTEXT: Complete dashboard implementing The Founder's Codex philosophy
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* CONTEXT: Header with philosophical branding */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-serif text-foreground">
                The Founder's Codex
              </h1>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Your Command Center</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, Practitioner-Scholar
              </span>
              <Button variant="outline" size="sm">
                End Session
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* CONTEXT: Current week display with memento mori awareness */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Week 1,500 of your journey
          </h2>
          <p className="text-muted-foreground">
            Make this week count. Time is your most precious resource.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CONTEXT: Your Why - The fundamental purpose section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-serif text-foreground">
                Your Why
              </CardTitle>
              <CardDescription>
                Define your core purpose - the north star that guides every decision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-dashed border-border rounded-lg text-center text-muted-foreground">
                <p className="italic">
                  Your purpose awaits definition. This becomes the foundation for everything.
                </p>
                <Button className="mt-2">
                  Define Your Purpose
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CONTEXT: Daily Wisdom */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-foreground">
                Today's Wisdom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="italic text-muted-foreground text-center">
                "The best time to plant a tree was 20 years ago. The second best time is now."
              </blockquote>
              <p className="text-sm text-muted-foreground text-center mt-2">
                — Chinese Proverb
              </p>
            </CardContent>
          </Card>

          {/* CONTEXT: Weekly Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="font-semibold text-foreground">
                This Week's Focus
              </CardTitle>
              <CardDescription>
                What's your ONE thing this week?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-dashed border-border rounded-lg text-center text-muted-foreground">
                <p>Ready for focused action</p>
                <Button size="sm" className="mt-2">
                  Set Weekly Goal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CONTEXT: Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                🎯 Create Goal
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🔄 Track Habits
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📔 Journal Entry
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🧠 Decision Log
              </Button>
            </CardContent>
          </Card>

          {/* CONTEXT: Well-being Monitor */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Well-being Monitor</CardTitle>
              <CardDescription>
                How are you flourishing today?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Energy</span>
                  <span className="text-green-500">●●●○○</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Focus</span>
                  <span className="text-blue-500">●●●●○</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Clarity</span>
                  <span className="text-purple-500">●●●●●</span>
                </div>
                <Button size="sm" className="w-full mt-2">
                  Update PERMA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CONTEXT: Goal Stack - The Vision-to-Action System */}
          <div className="lg:col-span-2">
            <GoalTree className="h-fit" />
          </div>

          {/* CONTEXT: The 90-Year View - Memento Mori Engine */}
          <div className="lg:col-span-1">
            <LifeGrid 
              birthDate={new Date('1990-01-01')} // Demo data - would come from user profile
              goals={[
                { id: '1', title: 'Launch Startup', targetWeek: 1800, type: 'KEYSTONE' },
                { id: '2', title: 'Book Published', targetWeek: 2500, type: 'ANNUAL' },
                { id: '3', title: 'Exit Event', targetWeek: 3200, type: 'KEYSTONE' }
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  )
} 