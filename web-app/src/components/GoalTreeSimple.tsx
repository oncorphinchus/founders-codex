'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, Plus } from 'lucide-react'

// CONTEXT: Simplified Goal Stack component for testing
interface GoalTreeSimpleProps {
  className?: string
  onCreateGoal?: (parentId?: string) => void
}

export const GoalTreeSimple: React.FC<GoalTreeSimpleProps> = ({ className, onCreateGoal }) => {
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
        {/* CONTEXT: Placeholder for goal hierarchy */}
        <div className="text-center py-8 space-y-4">
          <div className="text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Goal Stack Ready</p>
            <p className="text-sm">
              Your hierarchical goal system will appear here.
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

export default GoalTreeSimple 