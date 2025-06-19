'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { calculateAge, calculateWeeksLived, calculateWeeksRemaining } from '@/lib/utils'
import { Calendar, Clock, Star, Target } from 'lucide-react'

// CONTEXT: The Finite Lifespan - memento mori engine for powerful psychological impact
interface LifeGridProps {
  birthDate?: Date
  goals?: Array<{ id: string; title: string; targetWeek: number; type: 'KEYSTONE' | 'ANNUAL' | 'QUARTERLY' }>
  className?: string
}

// CONTEXT: Life epochs for meaningful narrative structure
interface LifeEpoch {
  id: string
  name: string
  startWeek: number
  endWeek: number
  color: string
  description: string
}

const DEFAULT_BIRTH_DATE = new Date('1990-01-01') // Fallback for demo
const TOTAL_WEEKS = 90 * 52 // 4,680 weeks in 90 years

// CONTEXT: Predefined life epochs based on common human development stages
const DEFAULT_EPOCHS: LifeEpoch[] = [
  { id: 'childhood', name: 'Childhood', startWeek: 0, endWeek: 936, color: 'bg-blue-200', description: 'The foundation years' },
  { id: 'education', name: 'Education', startWeek: 936, endWeek: 1248, color: 'bg-green-200', description: 'Learning and growth' },
  { id: 'career-building', name: 'Career Building', startWeek: 1248, endWeek: 2080, color: 'bg-yellow-200', description: 'Professional development' },
  { id: 'mastery', name: 'Mastery Era', startWeek: 2080, endWeek: 3120, color: 'bg-purple-200', description: 'Peak performance years' },
  { id: 'wisdom', name: 'Wisdom & Legacy', startWeek: 3120, endWeek: 4680, color: 'bg-bronze-200', description: 'Sharing knowledge and building legacy' }
]

export function LifeGrid({ birthDate = DEFAULT_BIRTH_DATE, goals = [], className }: LifeGridProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [showEpochs, setShowEpochs] = useState(true)
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)

  // CONTEXT: Critical calculations for finite time awareness
  const weeksLived = useMemo(() => calculateWeeksLived(birthDate), [birthDate])
  const currentAge = useMemo(() => calculateAge(birthDate), [birthDate])
  const weeksRemaining = useMemo(() => calculateWeeksRemaining(birthDate), [birthDate])
  const currentWeek = weeksLived

  // CONTEXT: Goal positioning on the life timeline
  const goalsByWeek = useMemo(() => {
    const goalMap = new Map<number, typeof goals[0][]>()
    goals.forEach(goal => {
      const existing = goalMap.get(goal.targetWeek) || []
      goalMap.set(goal.targetWeek, [...existing, goal])
    })
    return goalMap
  }, [goals])

  // CONTEXT: Week grid generation with philosophical weight
  const weeks = useMemo(() => {
    return Array.from({ length: TOTAL_WEEKS }, (_, index) => {
      const weekNumber = index + 1
      const isPast = weekNumber <= weeksLived
      const isCurrent = weekNumber === currentWeek
      const isFuture = weekNumber > weeksLived
      const hasGoals = goalsByWeek.has(weekNumber)
      
      // Calculate age at this week for hover information
      const ageAtWeek = Math.floor(weekNumber / 52)
      const yearProgress = (weekNumber % 52) / 52
      const preciseAge = ageAtWeek + yearProgress

      return {
        week: weekNumber,
        isPast,
        isCurrent,
        isFuture,
        hasGoals,
        goals: goalsByWeek.get(weekNumber) || [],
        ageAtWeek: preciseAge,
        epoch: DEFAULT_EPOCHS.find(epoch => 
          weekNumber >= epoch.startWeek && weekNumber < epoch.endWeek
        )
      }
    })
  }, [weeksLived, currentWeek, goalsByWeek])

  // CONTEXT: Visual representation functions
  const getWeekClassName = (week: typeof weeks[0]) => {
    let baseClasses = 'w-2 h-2 border border-gray-200 cursor-pointer transition-all duration-200 hover:scale-110'
    
    if (week.isCurrent) {
      return `${baseClasses} bg-primary ring-2 ring-primary ring-offset-1 animate-pulse`
    }
    
    if (week.isPast) {
      return `${baseClasses} bg-gray-400 opacity-60` // Sunk time
    }
    
    if (week.hasGoals) {
      const hasKeystone = week.goals.some(g => g.type === 'KEYSTONE')
      if (hasKeystone) {
        return `${baseClasses} bg-gold-500 ring-1 ring-gold-600` // Keystone goals
      }
      return `${baseClasses} bg-blue-500 ring-1 ring-blue-600` // Other goals
    }
    
    if (showEpochs && week.epoch) {
      return `${baseClasses} ${week.epoch.color} opacity-30`
    }
    
    return `${baseClasses} bg-gray-100 hover:bg-gray-200` // Future weeks
  }

  const handleWeekClick = (weekNumber: number) => {
    setSelectedWeek(weekNumber === selectedWeek ? null : weekNumber)
  }

  const getAgeAtWeek = (weekNumber: number) => {
    return Math.floor(weekNumber / 52)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Calendar className="w-5 h-5" />
              Your 90-Year View
            </CardTitle>
            <CardDescription>
              4,680 weeks to create your legacy • Week {currentWeek} of your journey
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              <Clock className="w-3 h-3 mr-1" />
              Age {currentAge}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEpochs(!showEpochs)}
            >
              {showEpochs ? 'Hide' : 'Show'} Epochs
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* CONTEXT: Powerful statistics for finite time awareness */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{weeksLived}</div>
            <div className="text-sm text-muted-foreground">Weeks Experienced</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{weeksRemaining}</div>
            <div className="text-sm text-muted-foreground">Weeks Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{goals.length}</div>
            <div className="text-sm text-muted-foreground">Future Anchors</div>
          </div>
        </div>

        {/* CONTEXT: The main visual grid - stark representation of finite time */}
        <div className="relative">
          <div className="grid grid-cols-52 gap-1 p-4 bg-white border-2 border-gray-200 rounded-lg">
            {weeks.map(week => (
              <div
                key={week.week}
                className={getWeekClassName(week)}
                onClick={() => handleWeekClick(week.week)}
                onMouseEnter={() => setHoveredWeek(week.week)}
                onMouseLeave={() => setHoveredWeek(null)}
                title={`Week ${week.week} • Age ${getAgeAtWeek(week.week)} • ${week.hasGoals ? `${week.goals.length} goal(s)` : week.epoch?.name || 'Future'}`}
              />
            ))}
          </div>

          {/* CONTEXT: Hover information overlay */}
          {hoveredWeek && (
            <div className="absolute top-0 left-0 bg-black text-white p-2 rounded shadow-lg text-xs z-10 pointer-events-none">
              <div className="font-medium">Week {hoveredWeek}</div>
              <div>Age {getAgeAtWeek(hoveredWeek)}</div>
              {goalsByWeek.get(hoveredWeek) && (
                <div className="mt-1">
                  {goalsByWeek.get(hoveredWeek)!.map(goal => (
                    <div key={goal.id} className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {goal.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CONTEXT: Legend and controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded border"></div>
            <span>Past ({weeksLived} weeks)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded border animate-pulse"></div>
            <span>Current Week</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded border"></div>
            <span>Goals Set</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gold-500 rounded border"></div>
            <span>Keystone Goals</span>
          </div>
        </div>

        {/* CONTEXT: Selected week information */}
        {selectedWeek && (
          <div className="p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-medium mb-2">Week {selectedWeek} Details</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>Age: {getAgeAtWeek(selectedWeek)} years old</div>
              <div>
                Status: {selectedWeek <= weeksLived ? 'Experienced' : 'Future opportunity'}
              </div>
              {goalsByWeek.get(selectedWeek) && (
                <div className="mt-2">
                  <div className="font-medium text-foreground">Goals for this week:</div>
                  {goalsByWeek.get(selectedWeek)!.map(goal => (
                    <div key={goal.id} className="flex items-center gap-2 mt-1">
                      <Star className="w-3 h-3" />
                      <span>{goal.title}</span>
                      <Badge variant="outline">{goal.type}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTEXT: Call to action for goals */}
        <div className="text-center p-4 border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-2">
            "The best time to plant a tree was 20 years ago. The second best time is now."
          </p>
          <Button className="mt-2">
            <Target className="w-4 h-4 mr-2" />
            Set Your First Keystone Goal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 