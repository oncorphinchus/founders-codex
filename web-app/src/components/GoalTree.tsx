'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ApiClient, Goal, GoalType, GoalStatus } from '@founders-codex/libs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, Plus, ChevronRight, Star, Calendar, TrendingUp, Brain } from 'lucide-react'

// CONTEXT: Goal Tree component implementing The Practitioner-Scholar hierarchical system
interface GoalTreeProps {
  className?: string
  onCreateGoal?: (parentId?: string) => void
}

// CONTEXT: API client for live backend integration
const apiClient = new ApiClient()

// CONTEXT: Goal type hierarchy configuration
const GOAL_TYPE_CONFIG = {
  [GoalType.KEYSTONE]: {
    icon: Star,
    label: '10-Year Keystone',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Your ultimate vision and legacy'
  },
  [GoalType.ANNUAL]: {
    icon: Calendar,
    label: 'Annual Objective',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'This year\'s major milestone'
  },
  [GoalType.QUARTERLY]: {
    icon: TrendingUp,
    label: 'Quarterly Rock',
    color: 'bg-green-100 text-green-800 border-green-200',
    description: '90-day focused execution'
  },
  [GoalType.WEEKLY]: {
    icon: Target,
    label: 'Weekly Sprint',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    description: 'This week\'s priority'
  },
  [GoalType.DAILY_ATOMIC]: {
    icon: Brain,
    label: 'Daily Atomic',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Today\'s focused action'
  }
}

// CONTEXT: Goal status configuration following "Language of Growth" principle
const STATUS_CONFIG = {
  [GoalStatus.NOT_STARTED]: {
    label: 'Ready to Begin',
    color: 'bg-gray-100 text-gray-800'
  },
  [GoalStatus.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800'
  },
  [GoalStatus.COMPLETE]: {
    label: 'Complete',
    color: 'bg-green-100 text-green-800'
  },
  [GoalStatus.LEARNING_IN_PROGRESS]: {
    label: 'Learning in Progress',
    color: 'bg-purple-100 text-purple-800'
  }
}

// CONTEXT: Individual goal card component
const GoalCard: React.FC<{
  goal: Goal
  onCreateChild?: (parentId: string) => void
  depth?: number
}> = ({ goal, onCreateChild, depth = 0 }) => {
  const config = GOAL_TYPE_CONFIG[goal.type]
  const statusConfig = STATUS_CONFIG[goal.status]
  const IconComponent = config.icon

  return (
    <div className={`ml-${depth * 4} mb-2`}>
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className="h-4 w-4" />
                <Badge variant="outline" className={config.color}>
                  {config.label}
                </Badge>
                <Badge variant="outline" className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
                {goal.isHypothesis && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    Hypothesis
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-foreground mb-1">
                {goal.title}
              </h3>
              
              {goal.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {goal.description}
                </p>
              )}

              {goal.isHypothesis && goal.hypothesisTest && (
                <div className="text-sm bg-amber-50 p-2 rounded border">
                  <strong>Test:</strong> {goal.hypothesisTest}
                  {goal.hypothesisMetric && (
                    <div><strong>Metric:</strong> {goal.hypothesisMetric}</div>
                  )}
                </div>
              )}

              {goal.learnings && (
                <div className="text-sm bg-green-50 p-2 rounded border mt-2">
                  <strong>Learnings:</strong> {goal.learnings}
                </div>
              )}

              {goal.targetDate && (
                <div className="text-xs text-muted-foreground mt-2">
                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                </div>
              )}
            </div>

            {onCreateChild && goal.type !== GoalType.DAILY_ATOMIC && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCreateChild(goal.id)}
                className="ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CONTEXT: Render child goals recursively */}
      {goal.children && goal.children.length > 0 && (
        <div className="mt-2">
          {goal.children.map((child) => (
            <GoalCard
              key={child.id}
              goal={child}
              onCreateChild={onCreateChild}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// CONTEXT: Main Goal Tree component
export const GoalTree: React.FC<GoalTreeProps> = ({ className, onCreateGoal }) => {
  // CONTEXT: Fetch goal hierarchy from live API
  const { data: goals, isLoading, error, refetch } = useQuery({
    queryKey: ['goals', 'hierarchy'],
    queryFn: () => apiClient.getGoalHierarchy(),
    retry: 2,
    staleTime: 30000, // Cache for 30 seconds
  })

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-foreground flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Goal Stack
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your strategic alignment system...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-foreground flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Goal Stack
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">Connection Challenge</p>
              <p className="text-sm">
                Your goal system is ready when you are.
              </p>
            </div>
            <Button onClick={() => refetch()}>
              Reconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!goals || goals.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-foreground flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Goal Stack
            </CardTitle>
            <Button onClick={() => onCreateGoal?.()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Your Strategic Foundation Awaits</p>
              <p className="text-sm">
                Start by defining your 10-year Keystone goal - your ultimate vision.
              </p>
              <p className="text-xs mt-2 italic">
                "Every great journey begins with a single, clear destination."
              </p>
            </div>
            <Button onClick={() => onCreateGoal?.()}>
              Create Your First Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-foreground flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Goal Stack
          </CardTitle>
          <Button onClick={() => onCreateGoal?.()} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Your hierarchical system for strategic alignment
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onCreateChild={onCreateGoal}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default GoalTree 