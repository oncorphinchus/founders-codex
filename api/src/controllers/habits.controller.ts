import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { CreateHabitDto } from '../dto/create-habit.dto';
import { UpdateHabitDto } from '../dto/update-habit.dto';

// CONTEXT: RESTful API for "The 1% Better System" - atomic habit formation
// Provides endpoints for creating, tracking, and visualizing habit progress
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  // CONTEXT: Creates new atomic habits with guidance toward "too small to fail" actions
  @Post()
  create(@Body() createHabitDto: CreateHabitDto) {
    // TODO: Get userId from authentication context
    const userId = 'user-123'; // Temporary placeholder
    return this.habitsService.create(userId, createHabitDto);
  }

  // CONTEXT: Retrieves all user habits with calculated metrics for dashboard display
  // Includes streaks, completion rates, and today's completion status
  @Get()
  findAll(@Query('days') days?: string) {
    const userId = 'user-123'; // Temporary placeholder
    const daysNumber = days ? parseInt(days, 10) : 90;
    return this.habitsService.findAllByUser(userId, daysNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = 'user-123'; // Temporary placeholder
    return this.habitsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    const userId = 'user-123'; // Temporary placeholder
    return this.habitsService.update(id, userId, updateHabitDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    const userId = 'user-123'; // Temporary placeholder
    return this.habitsService.remove(id, userId);
  }

  // CONTEXT: Core habit completion endpoint - implements "Make it satisfying" principle
  // Creates completion record for streak calculation and visual feedback
  @Post(':id/complete')
  @HttpCode(HttpStatus.CREATED)
  completeHabit(@Param('id') id: string, @Body() body?: { date?: string }) {
    const userId = 'user-123'; // Temporary placeholder
    const date = body?.date ? new Date(body.date) : undefined;
    return this.habitsService.completeHabit(id, userId, date);
  }

  // CONTEXT: Retrieves completion history for visual habit chains (heat maps, charts)
  // Essential for "not breaking the chain" psychology and progress visualization
  @Get(':id/completions')
  getCompletions(@Param('id') id: string, @Query('days') days?: string) {
    const userId = 'user-123'; // Temporary placeholder
    const daysNumber = days ? parseInt(days, 10) : 90;
    return this.habitsService.getHabitCompletions(id, userId, daysNumber);
  }
} 