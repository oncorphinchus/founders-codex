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
  UseGuards,
  Request,
} from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { CreateHabitDto } from '../dto/create-habit.dto';
import { UpdateHabitDto } from '../dto/update-habit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// CONTEXT: RESTful API for "The 1% Better System" - atomic habit formation
// Provides endpoints for creating, tracking, and visualizing habit progress
@Controller('habits')
@UseGuards(JwtAuthGuard) // CONTEXT: Secure all habit endpoints with authentication
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  // CONTEXT: Creates new atomic habits with guidance toward "too small to fail" actions
  @Post()
  create(@Body() createHabitDto: CreateHabitDto, @Request() req: any) {
    const userId = req.user.id; // Extract from authenticated user
    return this.habitsService.create(userId, createHabitDto);
  }

  // CONTEXT: Retrieves all user habits with calculated metrics for dashboard display
  // Includes streaks, completion rates, and today's completion status
  @Get()
  findAll(@Request() req: any, @Query('days') days?: string) {
    const userId = req.user.id;
    const daysNumber = days ? parseInt(days, 10) : 90;
    return this.habitsService.findAllByUser(userId, daysNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.habitsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() updateHabitDto: UpdateHabitDto) {
    const userId = req.user.id;
    return this.habitsService.update(id, userId, updateHabitDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.habitsService.remove(id, userId);
  }

  // CONTEXT: Core habit completion endpoint - implements "Make it satisfying" principle
  // Creates completion record for streak calculation and visual feedback
  @Post(':id/complete')
  @HttpCode(HttpStatus.CREATED)
  completeHabit(@Param('id') id: string, @Request() req: any, @Body() body?: { date?: string }) {
    const userId = req.user.id;
    const date = body?.date ? new Date(body.date) : undefined;
    return this.habitsService.completeHabit(id, userId, date);
  }

  // CONTEXT: Retrieves completion history for visual habit chains (heat maps, charts)
  // Essential for "not breaking the chain" psychology and progress visualization
  @Get(':id/completions')
  getCompletions(@Param('id') id: string, @Request() req: any, @Query('days') days?: string) {
    const userId = req.user.id;
    const daysNumber = days ? parseInt(days, 10) : 90;
    return this.habitsService.getHabitCompletions(id, userId, daysNumber);
  }
} 