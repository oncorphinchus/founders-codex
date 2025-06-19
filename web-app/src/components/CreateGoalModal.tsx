'use client'

import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiClient, GoalType, Goal } from '@founders-codex/libs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Star, Calendar, TrendingUp, Brain, Lightbulb } from 'lucide-react'

// CONTEXT: Goal creation modal implementing SMART framework and hierarchy validation
interface CreateGoalModalProps {
  isOpen: boolean
  onClose: () => void
  parentGoalId?: string
}

// CONTEXT: API client for live backend integration
const apiClient = new ApiClient()

// CONTEXT: Goal type configuration with philosophical context
const GOAL_TYPE_OPTIONS = [
  {
    value: GoalType.KEYSTONE,
    label: '10-Year Keystone',
    icon: Star,
    description: 'Your ultimate vision and legacy - the foundation of everything',
    timeframe: '10 years',
    examples: ['Build a transformative company', 'Become a thought leader in your field']
  },
  {
    value: GoalType.ANNUAL,
    label: 'Annual Objective',
    icon: Calendar,
    description: 'This year\'s major milestone that serves your keystone',
    timeframe: '1 year',
    examples: ['Launch new product line', 'Achieve $1M revenue']
  },
  {
    value: GoalType.QUARTERLY,
    label: 'Quarterly Rock',
    icon: TrendingUp,
    description: '90-day focused execution that drives annual progress',
    timeframe: '3 months',
    examples: ['Complete market research', 'Build MVP']
  },
  {
    value: GoalType.WEEKLY,
    label: 'Weekly Sprint',
    icon: Target,
    description: 'This week\'s priority that advances quarterly rocks',
    timeframe: '1 week',
    examples: ['Conduct 5 customer interviews', 'Complete prototype']
  },
  {
    value: GoalType.DAILY_ATOMIC,
    label: 'Daily Atomic',
    icon: Brain,
    description: 'Today\'s focused action - small but significant',
    timeframe: '1 day',
    examples: ['Write 500 words', 'Make 3 prospect calls']
  }
]

// CONTEXT: Form data interface following SMART criteria
interface GoalFormData {
  type: GoalType | ''
  title: string
  description: string
  targetDate: string
  isHypothesis: boolean
  hypothesisTest: string
  hypothesisMetric: string
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  parentGoalId
}) => {
  const queryClient = useQueryClient()
  
  // CONTEXT: Form state management
  const [formData, setFormData] = useState<GoalFormData>({
    type: '',
    title: '',
    description: '',
    targetDate: '',
    isHypothesis: false,
    hypothesisTest: '',
    hypothesisMetric: ''
  })
  
  const [errors, setErrors] = useState<Partial<GoalFormData>>({})

  // CONTEXT: Goal creation mutation with optimistic updates
  const createGoalMutation = useMutation({
    mutationFn: (data: Partial<Goal>) => apiClient.createGoal(data),
    onSuccess: () => {
      // CONTEXT: Invalidate and refetch goal hierarchy
      queryClient.invalidateQueries({ queryKey: ['goals', 'hierarchy'] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      
      // CONTEXT: Reset form and close modal
      handleClose()
    },
    onError: (error: any) => {
      console.error('Goal creation error:', error)
    }
  })

  // CONTEXT: Form validation following SMART criteria
  const validateForm = (): boolean => {
    const newErrors: Partial<GoalFormData> = {}

    if (!formData.type) {
      newErrors.type = 'Goal type is required for strategic alignment'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'A clear, specific title is essential'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description helps clarify your vision'
    }

    if (!formData.targetDate) {
      newErrors.targetDate = 'Timeline creates urgency and focus'
    }

    if (formData.isHypothesis) {
      if (!formData.hypothesisTest.trim()) {
        newErrors.hypothesisTest = 'Define how you will test this hypothesis'
      }
      if (!formData.hypothesisMetric.trim()) {
        newErrors.hypothesisMetric = 'Specify what metrics will prove success'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // CONTEXT: Handle form submission with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const goalData: Partial<Goal> = {
      type: formData.type as GoalType,
      title: formData.title.trim(),
      description: formData.description.trim(),
      targetDate: formData.targetDate,
      parentId: parentGoalId,
      isHypothesis: formData.isHypothesis,
      hypothesisTest: formData.isHypothesis ? formData.hypothesisTest.trim() : undefined,
      hypothesisMetric: formData.isHypothesis ? formData.hypothesisMetric.trim() : undefined,
    }

    createGoalMutation.mutate(goalData)
  }

  // CONTEXT: Clean form reset
  const handleClose = () => {
    setFormData({
      type: '',
      title: '',
      description: '',
      targetDate: '',
      isHypothesis: false,
      hypothesisTest: '',
      hypothesisMetric: ''
    })
    setErrors({})
    onClose()
  }

  // CONTEXT: Update form field with validation clearing
  const updateField = (field: keyof GoalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-foreground flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Create New Goal
          </DialogTitle>
          <DialogDescription>
            {parentGoalId 
              ? "Create a goal that serves your higher objective" 
              : "Define a strategic goal that aligns with your vision"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CONTEXT: Goal Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">Goal Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => updateField('type', value as GoalType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the strategic level of this goal" />
              </SelectTrigger>
              <SelectContent>
                {GOAL_TYPE_OPTIONS.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <IconComponent className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.timeframe}</div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            
            {formData.type && (
              <Card className="mt-2">
                <CardContent className="p-3">
                  <div className="flex items-start">
                    {React.createElement(
                      GOAL_TYPE_OPTIONS.find(opt => opt.value === formData.type)?.icon || Target,
                      { className: "h-4 w-4 mr-2 mt-0.5" }
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {GOAL_TYPE_OPTIONS.find(opt => opt.value === formData.type)?.description}
                      </p>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Examples:</strong> {GOAL_TYPE_OPTIONS.find(opt => opt.value === formData.type)?.examples.join(', ')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* CONTEXT: SMART Goal Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title * (Specific & Clear)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="What exactly will you accomplish?"
              className="text-base"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* CONTEXT: Goal Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description * (Measurable & Achievable)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe what success looks like and how you'll measure it..."
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* CONTEXT: Target Date */}
          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date * (Time-Bound)</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => updateField('targetDate', e.target.value)}
            />
            {errors.targetDate && <p className="text-sm text-red-500">{errors.targetDate}</p>}
          </div>

          {/* CONTEXT: Hypothesis Tracking */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hypothesis"
                checked={formData.isHypothesis}
                onCheckedChange={(checked) => updateField('isHypothesis', checked)}
              />
              <Label htmlFor="hypothesis" className="flex items-center">
                <Lightbulb className="h-4 w-4 mr-1" />
                This is a business hypothesis to test
              </Label>
            </div>

            {formData.isHypothesis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hypothesis Testing Framework</CardTitle>
                  <CardDescription>
                    Define how you'll validate this assumption
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hypothesisTest">Test Method *</Label>
                    <Textarea
                      id="hypothesisTest"
                      value={formData.hypothesisTest}
                      onChange={(e) => updateField('hypothesisTest', e.target.value)}
                      placeholder="How will you test this hypothesis? What specific actions will you take?"
                      rows={2}
                    />
                    {errors.hypothesisTest && <p className="text-sm text-red-500">{errors.hypothesisTest}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hypothesisMetric">Success Metric *</Label>
                    <Input
                      id="hypothesisMetric"
                      value={formData.hypothesisMetric}
                      onChange={(e) => updateField('hypothesisMetric', e.target.value)}
                      placeholder="What metric will prove or disprove this hypothesis?"
                    />
                    {errors.hypothesisMetric && <p className="text-sm text-red-500">{errors.hypothesisMetric}</p>}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createGoalMutation.isPending}
              className="min-w-[100px]"
            >
              {createGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGoalModal 