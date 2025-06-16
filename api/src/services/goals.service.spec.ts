import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Goal, GoalType, GoalStatus } from '../entities/goal.entity';

describe('GoalsService', () => {
  let service: GoalsService;
  let repository: Repository<Goal>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        {
          provide: getRepositoryToken(Goal),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
    repository = module.get<Repository<Goal>>(getRepositoryToken(Goal));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'test-user-id';

    it('should create a Keystone goal without parent', async () => {
      // CONTEXT: Tests the foundational principle - Keystones anchor the vision
      const createGoalDto = {
        type: GoalType.KEYSTONE,
        title: 'Build a $10M sustainable business',
        description: '10-year vision anchor',
      };

      const savedGoal = { id: 'goal-id', ...createGoalDto, userId };
      mockRepository.create.mockReturnValue(savedGoal);
      mockRepository.save.mockResolvedValue(savedGoal);

      const result = await service.create(userId, createGoalDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createGoalDto,
        userId,
        parentId: undefined,
      });
      expect(result).toEqual(savedGoal);
    });

    it('should enforce hierarchy - prevent non-Keystone goals without parent', async () => {
      // CONTEXT: Tests "The Practitioner-Scholar" principle - every goal must serve a higher purpose
      const createGoalDto = {
        type: GoalType.ANNUAL,
        title: 'Launch MVP',
      };

      await expect(service.create(userId, createGoalDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(userId, createGoalDto)).rejects.toThrow(
        'All goals except Keystones must have a parent'
      );
    });

    it('should enforce hierarchy - prevent Keystone goals with parent', async () => {
      // CONTEXT: Tests vision anchor integrity - Keystones must be top-level
      const createGoalDto = {
        type: GoalType.KEYSTONE,
        title: 'Build a business',
        parentId: 'some-parent-id',
      };

      await expect(service.create(userId, createGoalDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(userId, createGoalDto)).rejects.toThrow(
        'Keystone goals cannot have a parent'
      );
    });

    it('should validate proper parent-child hierarchy', async () => {
      // CONTEXT: Tests the Vision-to-Action Funnel structure
      const parentGoal = {
        id: 'parent-id',
        type: GoalType.KEYSTONE,
        userId,
      };
      
      const createGoalDto = {
        type: GoalType.ANNUAL,
        title: 'This year\'s objective',
        parentId: 'parent-id',
      };

      mockRepository.findOne.mockResolvedValue(parentGoal);
      mockRepository.create.mockReturnValue({ id: 'child-id', ...createGoalDto, userId });
      mockRepository.save.mockResolvedValue({ id: 'child-id', ...createGoalDto, userId });

      const result = await service.create(userId, createGoalDto);

      expect(result).toBeDefined();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'parent-id', userId },
      });
    });

    it('should reject invalid hierarchy combinations', async () => {
      // CONTEXT: Tests hierarchy rules - Weekly goals cannot be children of Keystones
      const parentGoal = {
        id: 'parent-id',
        type: GoalType.KEYSTONE,
        userId,
      };
      
      const createGoalDto = {
        type: GoalType.WEEKLY,
        title: 'Invalid weekly goal',
        parentId: 'parent-id',
      };

      mockRepository.findOne.mockResolvedValue(parentGoal);

      await expect(service.create(userId, createGoalDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(userId, createGoalDto)).rejects.toThrow(
        'Invalid hierarchy'
      );
    });
  });

  describe('update', () => {
    const userId = 'test-user-id';
    const goalId = 'test-goal-id';

    it('should enforce "Language of Growth" principle when marking as learning', async () => {
      // CONTEXT: Tests that setbacks require learning capture for wisdom building
      const existingGoal = {
        id: goalId,
        userId,
        title: 'Test goal',
        status: GoalStatus.IN_PROGRESS,
      };

      mockRepository.findOne.mockResolvedValue(existingGoal);

      const updateDto = {
        status: GoalStatus.LEARNING_IN_PROGRESS,
        // Missing learnings field
      };

      await expect(service.update(goalId, userId, updateDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.update(goalId, userId, updateDto)).rejects.toThrow(
        'When a goal transitions to "Learning in Progress", please capture what was learned'
      );
    });

    it('should allow learning status with captured insights', async () => {
      // CONTEXT: Tests proper learning capture for Antifragile principle
      const existingGoal = {
        id: goalId,
        userId,
        title: 'Test goal',
        status: GoalStatus.IN_PROGRESS,
      };

      const updatedGoal = {
        ...existingGoal,
        status: GoalStatus.LEARNING_IN_PROGRESS,
        learnings: 'Market timing was wrong, need to validate demand first',
      };

      mockRepository.findOne.mockResolvedValue(existingGoal);
      mockRepository.save.mockResolvedValue(updatedGoal);

      const updateDto = {
        status: GoalStatus.LEARNING_IN_PROGRESS,
        learnings: 'Market timing was wrong, need to validate demand first',
      };

      const result = await service.update(goalId, userId, updateDto);

      expect(result.learnings).toBe('Market timing was wrong, need to validate demand first');
      expect(result.status).toBe(GoalStatus.LEARNING_IN_PROGRESS);
    });
  });

  describe('remove', () => {
    const userId = 'test-user-id';
    const goalId = 'test-goal-id';

    it('should prevent deletion of goals with active children', async () => {
      // CONTEXT: Tests hierarchy integrity - cannot break strategic alignment
      const existingGoal = {
        id: goalId,
        userId,
        title: 'Parent goal',
      };

      mockRepository.findOne.mockResolvedValue(existingGoal);
      mockRepository.count.mockResolvedValue(2); // Has 2 children

      await expect(service.remove(goalId, userId)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.remove(goalId, userId)).rejects.toThrow(
        'Cannot delete a goal that has active children'
      );
    });

    it('should allow deletion of goals without children', async () => {
      // CONTEXT: Tests clean deletion when hierarchy integrity is maintained
      const existingGoal = {
        id: goalId,
        userId,
        title: 'Leaf goal',
      };

      mockRepository.findOne.mockResolvedValue(existingGoal);
      mockRepository.count.mockResolvedValue(0); // No children
      mockRepository.remove.mockResolvedValue(existingGoal);

      await service.remove(goalId, userId);

      expect(mockRepository.remove).toHaveBeenCalledWith(existingGoal);
    });
  });

  describe('findHierarchyByUser', () => {
    it('should return only Keystone goals with nested children', async () => {
      // CONTEXT: Tests that hierarchy display starts from vision anchors
      const keystoneGoal = {
        id: 'keystone-1',
        type: GoalType.KEYSTONE,
        title: 'Vision anchor',
        children: [],
      };

      const annualGoal = {
        id: 'annual-1',
        type: GoalType.ANNUAL,
        title: 'This year goal',
        parentId: 'keystone-1',
        children: [],
      };

      const allGoals = [keystoneGoal, annualGoal];
      mockRepository.find.mockResolvedValue(allGoals);

      const result = await service.findHierarchyByUser('user-id');

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(GoalType.KEYSTONE);
    });
  });

  describe('markLearningInProgress', () => {
    it('should implement Antifragile principle by capturing learnings', async () => {
      // CONTEXT: Tests that setbacks are transformed into wisdom
      const existingGoal = {
        id: 'goal-id',
        userId: 'user-id',
        title: 'Failed experiment',
        status: GoalStatus.IN_PROGRESS,
      };

      const updatedGoal = {
        ...existingGoal,
        status: GoalStatus.LEARNING_IN_PROGRESS,
        learnings: 'Customer interviews revealed different problem priorities',
      };

      mockRepository.findOne.mockResolvedValue(existingGoal);
      mockRepository.save.mockResolvedValue(updatedGoal);

      const result = await service.markLearningInProgress(
        'goal-id',
        'user-id',
        'Customer interviews revealed different problem priorities'
      );

      expect(result.status).toBe(GoalStatus.LEARNING_IN_PROGRESS);
      expect(result.learnings).toBe('Customer interviews revealed different problem priorities');
    });
  });
});

// CONTEXT: Additional test that validates the philosophical principle enforcement
describe('Goal Entity Hierarchy Validation', () => {
  it('should validate proper hierarchy relationships', () => {
    // CONTEXT: Tests the static method that enforces Vision-to-Action Funnel
    expect(Goal.validateHierarchy(GoalType.KEYSTONE, undefined)).toBe(true);
    expect(Goal.validateHierarchy(GoalType.ANNUAL, GoalType.KEYSTONE)).toBe(true);
    expect(Goal.validateHierarchy(GoalType.QUARTERLY, GoalType.ANNUAL)).toBe(true);
    expect(Goal.validateHierarchy(GoalType.WEEKLY, GoalType.QUARTERLY)).toBe(true);
    expect(Goal.validateHierarchy(GoalType.DAILY_ATOMIC, GoalType.WEEKLY)).toBe(true);

    // Invalid combinations
    expect(Goal.validateHierarchy(GoalType.WEEKLY, GoalType.KEYSTONE)).toBe(false);
    expect(Goal.validateHierarchy(GoalType.ANNUAL, GoalType.QUARTERLY)).toBe(false);
    expect(Goal.validateHierarchy(GoalType.KEYSTONE, GoalType.ANNUAL)).toBe(false);
  });

  it('should ensure no goal can exist without serving a higher purpose except Keystones', () => {
    // CONTEXT: Tests core philosophical principle - every action serves a greater vision
    expect(Goal.validateHierarchy(GoalType.ANNUAL, undefined)).toBe(false);
    expect(Goal.validateHierarchy(GoalType.QUARTERLY, undefined)).toBe(false);
    expect(Goal.validateHierarchy(GoalType.WEEKLY, undefined)).toBe(false);
    expect(Goal.validateHierarchy(GoalType.DAILY_ATOMIC, undefined)).toBe(false);
  });
}); 