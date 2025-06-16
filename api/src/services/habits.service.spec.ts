import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { Habit } from '../entities/habit.entity';
import { HabitCompletion } from '../entities/habit-completion.entity';

// CONTEXT: Comprehensive testing for "The 1% Better System"
// Validates both technical functionality and philosophical principles
describe('HabitsService', () => {
  let service: HabitsService;
  let habitRepository: Repository<Habit>;
  let completionRepository: Repository<HabitCompletion>;

  const mockHabit: Partial<Habit> = {
    id: 'habit-1',
    userId: 'user-123',
    title: 'Read one page',
    cue: 'After my morning coffee',
    creationDate: new Date('2024-01-01'),
    completions: [],
  };

  const mockHabitRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockCompletionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        {
          provide: getRepositoryToken(Habit),
          useValue: mockHabitRepository,
        },
        {
          provide: getRepositoryToken(HabitCompletion),
          useValue: mockCompletionRepository,
        },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
    habitRepository = module.get<Repository<Habit>>(getRepositoryToken(Habit));
    completionRepository = module.get<Repository<HabitCompletion>>(getRepositoryToken(HabitCompletion));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    // CONTEXT: Tests atomic habit creation principles
    it('should create an atomic habit successfully', async () => {
      const createHabitDto = {
        title: 'Read one page',
        cue: 'After my morning coffee',
      };

      mockHabitRepository.create.mockReturnValue(mockHabit);
      mockHabitRepository.save.mockResolvedValue(mockHabit);
      mockHabitRepository.findOne.mockResolvedValue({
        ...mockHabit,
        completions: [],
      });

      const result = await service.create('user-123', createHabitDto);

      expect(mockHabitRepository.create).toHaveBeenCalledWith({
        ...createHabitDto,
        userId: 'user-123',
      });
      expect(result).toBeDefined();
      expect(result.title).toBe('Read one page');
    });

    // CONTEXT: Validates habit stacking implementation
    it('should preserve habit stacking cue', async () => {
      const createHabitDto = {
        title: 'Do one push-up',
        cue: 'After I wake up',
      };

      mockHabitRepository.create.mockReturnValue({
        ...mockHabit,
        ...createHabitDto,
      });
      mockHabitRepository.save.mockResolvedValue({
        ...mockHabit,
        ...createHabitDto,
      });
      mockHabitRepository.findOne.mockResolvedValue({
        ...mockHabit,
        ...createHabitDto,
        completions: [],
      });

      const result = await service.create('user-123', createHabitDto);

      expect(result.cue).toBe('After I wake up');
    });
  });

  describe('completeHabit', () => {
    // CONTEXT: Tests duplicate completion prevention
    // Maintains integrity of streak calculation and prevents gaming
    it('should prevent duplicate completion for the same day', async () => {
      const habitId = 'habit-1';
      const today = new Date('2024-06-16');
      
      mockHabitRepository.findOne.mockResolvedValue({
        ...mockHabit,
        completions: [],
      });
      
      // Mock existing completion for today
      mockCompletionRepository.findOne.mockResolvedValue({
        id: 'completion-1',
        habitId,
        completionDate: today,
      });

      await expect(
        service.completeHabit(habitId, 'user-123', today)
      ).rejects.toThrow(BadRequestException);
      
      expect(mockCompletionRepository.save).not.toHaveBeenCalled();
    });

    // CONTEXT: Tests successful completion with proper date handling
    it('should create completion record with date-only format', async () => {
      const habitId = 'habit-1';
      const today = new Date('2024-06-16T15:30:00Z'); // With time
      const expectedDate = new Date('2024-06-16'); // Date only
      
      mockHabitRepository.findOne.mockResolvedValue({
        ...mockHabit,
        completions: [],
      });
      
      mockCompletionRepository.findOne.mockResolvedValue(null);
      mockCompletionRepository.create.mockReturnValue({
        habitId,
        completionDate: expectedDate,
      });
      mockCompletionRepository.save.mockResolvedValue({
        id: 'completion-1',
        habitId,
        completionDate: expectedDate,
      });

      const result = await service.completeHabit(habitId, 'user-123', today);

      expect(mockCompletionRepository.create).toHaveBeenCalledWith({
        habitId,
        completionDate: expectedDate,
      });
      expect(result).toBeDefined();
    });

    // CONTEXT: Tests user ownership validation
    it('should throw NotFoundException for non-existent habit', async () => {
      mockHabitRepository.findOne.mockResolvedValue(null);

      await expect(
        service.completeHabit('non-existent', 'user-123')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('streak calculation', () => {
    // CONTEXT: Critical tests for "not breaking the chain" psychology
    // Validates core motivation mechanism
    it('should calculate current streak correctly for consecutive days', async () => {
      const habitId = 'habit-1';
      const today = new Date('2024-06-16');
      
      // Mock 5 consecutive days of completions
      const completions = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        completions.push({
          id: `completion-${i}`,
          habitId,
          completionDate: date,
        });
      }

      mockHabitRepository.findOne.mockResolvedValue({
        ...mockHabit,
        completions,
      });
      mockCompletionRepository.find.mockResolvedValue(completions);

      const result = await service.findOne(habitId, 'user-123');

      // Should have a current streak of 5
      expect(result.currentStreak).toBe(5);
    });

    it('should return zero streak when habit not completed today or yesterday', async () => {
      const habitId = 'habit-1';
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      const completions = [{
        id: 'completion-1',
        habitId,
        completionDate: threeDaysAgo,
      }];

      mockHabitRepository.findOne.mockResolvedValue({
        ...mockHabit,
        completions,
      });
      mockCompletionRepository.find.mockResolvedValue(completions);

      const result = await service.findOne(habitId, 'user-123');

      expect(result.currentStreak).toBe(0);
    });

    it('should calculate longest streak correctly', async () => {
      const habitId = 'habit-1';
      const today = new Date('2024-06-16');
      
      // Create a pattern: 3 days, gap, 5 days (longest), gap, 2 days
      const completions = [];
      
      // Recent 2 days
      for (let i = 0; i < 2; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        completions.push({
          id: `recent-${i}`,
          habitId,
          completionDate: date,
        });
      }
      
      // 5-day streak (longest) - with gap before
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (5 + i));
        completions.push({
          id: `longest-${i}`,
          habitId,
          completionDate: date,
        });
      }
      
      // 3-day streak - with gap before
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (12 + i));
        completions.push({
          id: `first-${i}`,
          habitId,
          completionDate: date,
        });
      }

      mockHabitRepository.findOne.mockResolvedValue({
        ...mockHabit,
        completions,
      });
      
      // Sort completions by date for longest streak calculation
      const sortedCompletions = completions.sort((a, b) => 
        a.completionDate.getTime() - b.completionDate.getTime()
      );
      mockCompletionRepository.find.mockResolvedValue(sortedCompletions);

      const result = await service.findOne(habitId, 'user-123');

      expect(result.longestStreak).toBe(5);
    });
  });

  describe('completion rate calculation', () => {
    // CONTEXT: Tests progress tracking for motivation
    it('should calculate completion rate correctly', async () => {
      const habitId = 'habit-1';
      const daysToCheck = 30;
      
      // Create 20 completions out of 30 days = 67% rate
      const completions = [];
      for (let i = 0; i < 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 1.5)); // Spread over 30 days
        completions.push({
          id: `completion-${i}`,
          habitId,
          completionDate: date,
        });
      }

      mockHabitRepository.find.mockResolvedValue([{
        ...mockHabit,
        completions,
      }]);

      const result = await service.findAllByUser('user-123', daysToCheck);

      expect(result[0].completionRate).toBeDefined();
      expect(result[0].completionRate).toBeGreaterThan(0);
    });
  });

  describe('user isolation', () => {
    // CONTEXT: Tests security - users can only access their own habits
    it('should only return habits for the specified user', async () => {
      const userHabits = [
        { ...mockHabit, userId: 'user-123' },
        { ...mockHabit, id: 'habit-2', userId: 'user-123' },
      ];

      mockHabitRepository.find.mockResolvedValue(userHabits);

      const result = await service.findAllByUser('user-123');

      expect(mockHabitRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        relations: ['completions'],
        order: { creationDate: 'DESC' },
      });
      expect(result).toHaveLength(2);
      expect(result.every(habit => habit.userId === 'user-123')).toBe(true);
    });

    it('should throw error when accessing habit from different user', async () => {
      mockHabitRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('habit-1', 'different-user')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('habit updating', () => {
    // CONTEXT: Tests habit modification while preserving atomic principles
    it('should update habit successfully', async () => {
      const updateDto = {
        title: 'Read two pages',
        cue: 'After breakfast',
      };

      mockHabitRepository.findOne.mockResolvedValue({
        ...mockHabit,
        completions: [],
      });
      mockHabitRepository.save.mockResolvedValue({
        ...mockHabit,
        ...updateDto,
      });

      const result = await service.update('habit-1', 'user-123', updateDto);

      expect(mockHabitRepository.save).toHaveBeenCalled();
      expect(result.title).toBe('Read two pages');
      expect(result.cue).toBe('After breakfast');
    });
  });

  describe('habit deletion', () => {
    it('should delete habit successfully', async () => {
      mockHabitRepository.findOne.mockResolvedValue({
        ...mockHabit,
        completions: [],
      });
      mockHabitRepository.remove.mockResolvedValue(mockHabit);

      await service.remove('habit-1', 'user-123');

      expect(mockHabitRepository.remove).toHaveBeenCalledWith({
        ...mockHabit,
        completions: [],
      });
    });
  });

  describe('philosophical principle validation', () => {
    // CONTEXT: Tests adherence to "The 1% Better System" philosophy
    describe('atomic habit enforcement', () => {
      it('should support creation of tiny habits', async () => {
        const atomicHabit = {
          title: 'Do one push-up', // Atomic - very small
          cue: 'After I wake up',
        };

        mockHabitRepository.create.mockReturnValue({
          ...mockHabit,
          ...atomicHabit,
        });
        mockHabitRepository.save.mockResolvedValue({
          ...mockHabit,
          ...atomicHabit,
        });
        mockHabitRepository.findOne.mockResolvedValue({
          ...mockHabit,
          ...atomicHabit,
          completions: [],
        });

        const result = await service.create('user-123', atomicHabit);

        expect(result.title).toBe('Do one push-up');
        expect(result.cue).toBe('After I wake up');
      });
    });

    describe('celebrating process principle', () => {
      // CONTEXT: Tests that completion tracking supports "celebrating process"
      it('should track completion immediately for instant feedback', async () => {
        const habitId = 'habit-1';
        
        mockHabitRepository.findOne.mockResolvedValue({
          ...mockHabit,
          completions: [],
        });
        mockCompletionRepository.findOne.mockResolvedValue(null);
        mockCompletionRepository.create.mockReturnValue({
          habitId,
          completionDate: new Date(),
        });
        mockCompletionRepository.save.mockResolvedValue({
          id: 'completion-1',
          habitId,
          completionDate: new Date(),
        });

        const result = await service.completeHabit(habitId, 'user-123');

        expect(result).toBeDefined();
        expect(result.habitId).toBe(habitId);
        expect(mockCompletionRepository.save).toHaveBeenCalled();
      });
    });

    describe('visual habit chains support', () => {
      // CONTEXT: Tests data structure supports visual progress tracking
      it('should provide completion data for visual chains', async () => {
        const habitId = 'habit-1';
        const completions = [];
        
        // Create 7 days of completion data
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          completions.push({
            id: `completion-${i}`,
            habitId,
            completionDate: date,
          });
        }

        mockHabitRepository.findOne.mockResolvedValue({
          ...mockHabit,
          completions: [],
        });
        mockCompletionRepository.find.mockResolvedValue(completions);

        const result = await service.getHabitCompletions(habitId, 'user-123', 7);

        expect(result).toHaveLength(7);
        expect(result[0].completionDate).toBeDefined();
      });
    });
  });
}); 