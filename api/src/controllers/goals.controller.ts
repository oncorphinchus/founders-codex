import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { GoalsService } from '../services/goals.service';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { UpdateGoalDto } from '../dto/update-goal.dto';
import { GoalType, Goal } from '../entities/goal.entity';

// CONTEXT: RESTful API that operationalizes "The Practitioner-Scholar" principle
// Provides endpoints for the complete Vision-to-Action Funnel workflow
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  // CONTEXT: Creates new goals with strict hierarchy validation
  // Enforces strategic alignment by requiring parent linkage (except for Keystones)
  @Post()
  async create(
    @Body() createGoalDto: CreateGoalDto,
    @Query('userId') userId?: string, // In a real app, this would come from authentication
  ): Promise<Goal> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.goalsService.create(userId, createGoalDto);
  }

  // CONTEXT: Retrieves complete goal hierarchy for strategic overview
  @Get()
  async findAll(@Query('userId') userId?: string): Promise<Goal[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.goalsService.findAllByUser(userId);
  }

  // CONTEXT: Returns hierarchical tree structure for Goal Stack visualization
  // Only returns Keystones with nested children for efficient UI rendering
  @Get('hierarchy')
  async getHierarchy(@Query('userId') userId?: string): Promise<Goal[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.goalsService.findHierarchyByUser(userId);
  }

  // CONTEXT: Retrieves goals by type for focused management (e.g., today's Daily Atomic tasks)
  @Get('by-type/:type')
  async findByType(
    @Param('type') type: GoalType,
    @Query('userId') userId?: string,
  ): Promise<Goal[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.goalsService.findByType(userId, type);
  }

  // CONTEXT: Special endpoint for daily execution focus
  // Returns today's atomic tasks with parent context for purpose clarity
  @Get('today')
  async getTodaysTasks(@Query('userId') userId?: string): Promise<Goal[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.goalsService.getTodaysTasks(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ): Promise<Goal> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.goalsService.findOne(id, userId);
  }

  // CONTEXT: Updates goals with "Language of Growth" validation
  // Ensures learning capture when goals transition to "LEARNING_IN_PROGRESS"
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @Query('userId') userId?: string,
  ): Promise<Goal> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.goalsService.update(id, userId, updateGoalDto);
  }

  // CONTEXT: Marks goal as complete - celebrates achievement
  @Patch(':id/complete')
  async markComplete(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ): Promise<Goal> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.goalsService.markComplete(id, userId);
  }

  // CONTEXT: Reframes setbacks as learning opportunities (Antifragile principle)
  @Patch(':id/learning')
  async markLearningInProgress(
    @Param('id') id: string,
    @Body('learnings') learnings: string,
    @Query('userId') userId?: string,
  ): Promise<Goal> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!learnings) {
      throw new BadRequestException('Learnings are required when marking a goal as learning in progress');
    }

    return await this.goalsService.markLearningInProgress(id, userId, learnings);
  }

  // CONTEXT: Deletes goals with hierarchy integrity protection
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ): Promise<{ message: string }> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    await this.goalsService.remove(id, userId);
    return { message: 'Goal successfully removed while maintaining strategic alignment' };
  }
} 