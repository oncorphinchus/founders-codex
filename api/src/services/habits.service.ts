import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Habit } from '../entities/habit.entity';
import { HabitCompletion } from '../entities/habit-completion.entity';
import { CreateHabitDto } from '../dto/create-habit.dto';
import { UpdateHabitDto } from '../dto/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private habitsRepository: Repository<Habit>,
    @InjectRepository(HabitCompletion)
    private completionsRepository: Repository<HabitCompletion>,
  ) {}

  // CONTEXT: Creates atomic habits designed to be "too small to fail"
  // Implements James Clear's principle of starting with tiny, consistent actions
  async create(userId: string, createHabitDto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitsRepository.create({
      ...createHabitDto,
      userId,
    });

    const savedHabit = await this.habitsRepository.save(habit);
    
    // Return habit with calculated metrics for immediate UI feedback
    return await this.getHabitWithMetrics(savedHabit.id, userId);
  }

  // CONTEXT: Retrieves all habits with performance metrics for visual feedback
  // Calculates streaks and completion rates to "Make it satisfying"
  async findAllByUser(userId: string, days: number = 90): Promise<Habit[]> {
    const habits = await this.habitsRepository.find({
      where: { userId },
      relations: ['completions'],
      order: { creationDate: 'DESC' },
    });

    // Calculate metrics for each habit
    return await Promise.all(
      habits.map(habit => this.enrichHabitWithMetrics(habit, days))
    );
  }

  async findOne(id: string, userId: string): Promise<Habit> {
    const habit = await this.habitsRepository.findOne({
      where: { id, userId },
      relations: ['completions'],
    });

    if (!habit) {
      throw new NotFoundException('Habit not found or does not belong to user.');
    }

    return await this.enrichHabitWithMetrics(habit);
  }

  async update(id: string, userId: string, updateHabitDto: UpdateHabitDto): Promise<Habit> {
    const habit = await this.findOne(id, userId);
    Object.assign(habit, updateHabitDto);
    await this.habitsRepository.save(habit);
    return await this.getHabitWithMetrics(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const habit = await this.findOne(id, userId);
    await this.habitsRepository.remove(habit);
  }

  // CONTEXT: Core habit completion logic with duplicate prevention
  // Implements "Visual Habit Chains" by creating completion records for streaks
  async completeHabit(habitId: string, userId: string, date?: Date): Promise<HabitCompletion> {
    const habit = await this.findOne(habitId, userId);
    const completionDate = date || new Date();
    
    // Convert to date-only string to ensure consistent comparison
    const dateString = completionDate.toISOString().split('T')[0];
    const completionDateOnly = new Date(dateString);

    // CONTEXT: Prevent duplicate completions for the same day
    // Maintains integrity of streak calculation and prevents gaming the system
    const existingCompletion = await this.completionsRepository.findOne({
      where: {
        habitId,
        completionDate: completionDateOnly,
      },
    });

    if (existingCompletion) {
      throw new BadRequestException(
        'Habit already completed for this day. Each habit can only be completed once per day to maintain the integrity of your progress.'
      );
    }

    const completion = this.completionsRepository.create({
      habitId,
      completionDate: completionDateOnly,
    });

    return await this.completionsRepository.save(completion);
  }

  // CONTEXT: Retrieves completion data for visual feedback (heat maps, charts)
  async getHabitCompletions(
    habitId: string, 
    userId: string, 
    days: number = 90
  ): Promise<HabitCompletion[]> {
    await this.findOne(habitId, userId); // Verify ownership

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.completionsRepository.find({
      where: {
        habitId,
        completionDate: Between(startDate, new Date()),
      },
      order: { completionDate: 'ASC' },
    });
  }

  // CONTEXT: Critical method for "not breaking the chain" psychology
  // Calculates current streak to provide immediate motivation feedback
  private async calculateCurrentStreak(habitId: string): Promise<number> {
    const completions = await this.completionsRepository.find({
      where: { habitId },
      order: { completionDate: 'DESC' },
    });

    if (completions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Check if completed today
    const latestCompletion = completions[0];
    const latestCompletionString = latestCompletion.completionDate.toISOString().split('T')[0];
    
    // If not completed today, check if completed yesterday to maintain streak
    if (latestCompletionString === todayString) {
      streak = 1;
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      if (latestCompletionString !== yesterdayString) {
        return 0; // Streak is broken
      }
    }

    // Count consecutive days backwards
    for (let i = streak === 1 ? 1 : 0; i < completions.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - (streak === 1 ? i : i + 1));
      const expectedDateString = expectedDate.toISOString().split('T')[0];
      
      const completionDateString = completions[i].completionDate.toISOString().split('T')[0];
      
      if (completionDateString === expectedDateString) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // CONTEXT: Calculates longest streak for motivation and achievement recognition
  private async calculateLongestStreak(habitId: string): Promise<number> {
    const completions = await this.completionsRepository.find({
      where: { habitId },
      order: { completionDate: 'ASC' },
    });

    if (completions.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < completions.length; i++) {
      const prevDate = new Date(completions[i - 1].completionDate);
      const currDate = new Date(completions[i].completionDate);
      
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  }

  // CONTEXT: Calculates completion rate for progress tracking over specified period
  private calculateCompletionRate(completions: HabitCompletion[], days: number): number {
    if (days === 0) return 0;
    return Math.round((completions.length / days) * 100);
  }

  // CONTEXT: Checks if habit was completed today for UI state management
  private isCompletedToday(completions: HabitCompletion[]): boolean {
    const today = new Date().toISOString().split('T')[0];
    return completions.some(completion => 
      completion.completionDate.toISOString().split('T')[0] === today
    );
  }

  // CONTEXT: Helper method to enrich habit with calculated metrics
  private async enrichHabitWithMetrics(habit: Habit, days: number = 90): Promise<Habit> {
    // Get completions for the specified period
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const recentCompletions = habit.completions?.filter(
      completion => completion.completionDate >= startDate
    ) || [];

    // Calculate all metrics
    const [currentStreak, longestStreak] = await Promise.all([
      this.calculateCurrentStreak(habit.id),
      this.calculateLongestStreak(habit.id),
    ]);

    // Enrich habit object with calculated values
    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;
    habit.completionRate = this.calculateCompletionRate(recentCompletions, days);
    habit.isCompletedToday = this.isCompletedToday(habit.completions || []);

    return habit;
  }

  // CONTEXT: Helper to get habit with fresh metric calculations
  private async getHabitWithMetrics(habitId: string, userId: string): Promise<Habit> {
    const habit = await this.habitsRepository.findOne({
      where: { id: habitId, userId },
      relations: ['completions'],
    });

    if (!habit) {
      throw new NotFoundException('Habit not found.');
    }

    return await this.enrichHabitWithMetrics(habit);
  }
} 