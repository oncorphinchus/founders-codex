import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal, GoalType, GoalStatus } from '../entities/goal.entity';
import { User } from '../entities/user.entity';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { UpdateGoalDto } from '../dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalsRepository: Repository<Goal>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // CONTEXT: Implements "The Practitioner-Scholar" principle by enforcing strategic hierarchy
  // Every goal must serve a higher purpose, preventing busywork and ensuring alignment
  async create(userId: string, createGoalDto: CreateGoalDto): Promise<Goal> {
    const { type, parentId, ...goalData } = createGoalDto;

    // Validate hierarchy rules
    if (type !== GoalType.KEYSTONE && !parentId) {
      throw new BadRequestException(
        'All goals except Keystones must have a parent. This enforces strategic alignment where every action serves a greater purpose.'
      );
    }

    if (type === GoalType.KEYSTONE && parentId) {
      throw new BadRequestException(
        'Keystone goals cannot have a parent. They represent your highest-level vision anchors.'
      );
    }

    // Validate parent-child relationship
    if (parentId) {
      const parent = await this.goalsRepository.findOne({
        where: { id: parentId, user: { id: userId } },
      });

      if (!parent) {
        throw new NotFoundException('Parent goal not found or does not belong to user.');
      }

      if (!Goal.validateHierarchy(type, parent.type)) {
        throw new BadRequestException(
          `Invalid hierarchy: ${type} goals cannot be children of ${parent.type} goals. This maintains the Vision-to-Action Funnel structure.`
        );
      }
    }

    const goal = this.goalsRepository.create({
      ...goalData,
      type,
      parentId,
      user: { id: userId },
    });

    return await this.goalsRepository.save(goal);
  }

  // CONTEXT: Retrieves the complete hierarchical structure for strategic overview
  async findAllByUser(userId: string): Promise<Goal[]> {
    return await this.goalsRepository.find({
      where: { user: { id: userId } },
      relations: ['children', 'parent'],
      order: { createdAt: 'ASC' },
    });
  }

  // CONTEXT: Builds the hierarchical tree structure for UI visualization
  async findHierarchyByUser(userId: string): Promise<Goal[]> {
    const allGoals = await this.goalsRepository.find({
      where: { user: { id: userId } },
      relations: ['children', 'parent'],
      order: { createdAt: 'ASC' },
    });

    // Return only top-level goals (Keystones) with nested children
    return allGoals.filter(goal => goal.type === GoalType.KEYSTONE);
  }

  async findOne(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['children', 'parent'],
    });

    if (!goal) {
      throw new NotFoundException('Goal not found or does not belong to user.');
    }

    return goal;
  }

  // CONTEXT: Implements "Language of Growth" principle in status updates
  // Automatically handles transition to "LEARNING_IN_PROGRESS" for setbacks
  async update(id: string, userId: string, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.findOne(id, userId);

    // CONTEXT: If updating status to indicate a setback, ensure we capture learnings
    if (updateGoalDto.status === GoalStatus.LEARNING_IN_PROGRESS && !updateGoalDto.learnings) {
      throw new BadRequestException(
        'When a goal transitions to "Learning in Progress", please capture what was learned from this experience. This transforms setbacks into wisdom.'
      );
    }

    Object.assign(goal, updateGoalDto);
    return await this.goalsRepository.save(goal);
  }

  // CONTEXT: Marks a goal as complete and suggests reviewing connected learnings
  async markComplete(id: string, userId: string): Promise<Goal> {
    const goal = await this.findOne(id, userId);
    goal.status = GoalStatus.COMPLETE;
    return await this.goalsRepository.save(goal);
  }

  // CONTEXT: Handles strategic reframing of setbacks as learning opportunities
  async markLearningInProgress(id: string, userId: string, learnings: string): Promise<Goal> {
    const goal = await this.findOne(id, userId);
    goal.status = GoalStatus.LEARNING_IN_PROGRESS;
    goal.learnings = learnings;
    return await this.goalsRepository.save(goal);
  }

  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.findOne(id, userId);

    // CONTEXT: Prevent deletion of goals with active children to maintain hierarchy integrity
    const childrenCount = await this.goalsRepository.count({
      where: { parentId: id, user: { id: userId } }
    });

    if (childrenCount > 0) {
      throw new BadRequestException(
        'Cannot delete a goal that has active children. Please handle or reassign child goals first to maintain strategic alignment.'
      );
    }

    await this.goalsRepository.remove(goal);
  }

  // CONTEXT: Finds all goals of a specific type for targeted management
  async findByType(userId: string, type: GoalType): Promise<Goal[]> {
    return await this.goalsRepository.find({
      where: { user: { id: userId }, type },
      relations: ['children', 'parent'],
      order: { createdAt: 'ASC' },
    });
  }

  // CONTEXT: Retrieves daily atomic tasks for today's execution focus
  async getTodaysTasks(userId: string): Promise<Goal[]> {
    return await this.goalsRepository.find({
      where: {
        user: { id: userId },
        type: GoalType.DAILY_ATOMIC,
        status: GoalStatus.NOT_STARTED,
      },
      relations: ['parent'],
      order: { createdAt: 'ASC' },
    });
  }
} 