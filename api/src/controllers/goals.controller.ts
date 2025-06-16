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
  UseGuards,
  Request,
} from '@nestjs/common';
import { GoalsService } from '../services/goals.service';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { UpdateGoalDto } from '../dto/update-goal.dto';
import { GoalType, Goal } from '../entities/goal.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// CONTEXT: RESTful API that operationalizes "The Practitioner-Scholar" principle
// Provides endpoints for the complete Vision-to-Action Funnel workflow
@Controller('goals')
@UseGuards(JwtAuthGuard) // CONTEXT: Secure all goal endpoints with authentication
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  // CONTEXT: Creates new goals with strict hierarchy validation
  // Enforces strategic alignment by requiring parent linkage (except for Keystones)
  @Post()
  async create(
    @Body() createGoalDto: CreateGoalDto,
    @Request() req: any,
  ): Promise<Goal> {
    const userId = req.user.id; // Extract from authenticated user
    return await this.goalsService.create(userId, createGoalDto);
  }

  // CONTEXT: Retrieves complete goal hierarchy for strategic overview
  @Get()
  async findAll(@Request() req: any): Promise<Goal[]> {
    const userId = req.user.id;
    return await this.goalsService.findAllByUser(userId);
  }

  // CONTEXT: Returns hierarchical tree structure for Goal Stack visualization
  // Only returns Keystones with nested children for efficient UI rendering
  @Get('hierarchy')
  async getHierarchy(@Request() req: any): Promise<Goal[]> {
    const userId = req.user.id;
    return await this.goalsService.findHierarchyByUser(userId);
  }

  // CONTEXT: Retrieves goals by type for focused management (e.g., today's Daily Atomic tasks)
  @Get('by-type/:type')
  async findByType(
    @Param('type') type: GoalType,
    @Request() req: any,
  ): Promise<Goal[]> {
    const userId = req.user.id;
    return await this.goalsService.findByType(userId, type);
  }

  // CONTEXT: Special endpoint for daily execution focus
  // Returns today's atomic tasks with parent context for purpose clarity
  @Get('today')
  async getTodaysTasks(@Request() req: any): Promise<Goal[]> {
    const userId = req.user.id;
    return await this.goalsService.getTodaysTasks(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<Goal> {
    const userId = req.user.id;
    return await this.goalsService.findOne(id, userId);
  }

  // CONTEXT: Updates goals with "Language of Growth" validation
  // Ensures learning capture when goals transition to "LEARNING_IN_PROGRESS"
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @Request() req: any,
  ): Promise<Goal> {
    const userId = req.user.id;
    return await this.goalsService.update(id, userId, updateGoalDto);
  }

  // CONTEXT: Marks goal as complete - celebrates achievement
  @Patch(':id/complete')
  async markComplete(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<Goal> {
    const userId = req.user.id;
    return await this.goalsService.markComplete(id, userId);
  }

  // CONTEXT: Reframes setbacks as learning opportunities (Antifragile principle)
  @Patch(':id/learning')
  async markLearningInProgress(
    @Param('id') id: string,
    @Body('learnings') learnings: string,
    @Request() req: any,
  ): Promise<Goal> {
    const userId = req.user.id;

    if (!learnings) {
      throw new BadRequestException('Learnings are required when marking a goal as learning in progress');
    }

    return await this.goalsService.markLearningInProgress(id, userId, learnings);
  }

  // CONTEXT: Deletes goals with hierarchy integrity protection
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.goalsService.remove(id, userId);
    return { message: 'Goal successfully removed while maintaining strategic alignment' };
  }
} 