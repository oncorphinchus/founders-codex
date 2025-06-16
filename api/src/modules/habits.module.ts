import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsService } from '../services/habits.service';
import { HabitsController } from '../controllers/habits.controller';
import { Habit } from '../entities/habit.entity';
import { HabitCompletion } from '../entities/habit-completion.entity';
import { User } from '../entities/user.entity';

// CONTEXT: Module for "The 1% Better System" - atomic habit formation and tracking
// Integrates all components for habit creation, completion tracking, and streak calculation
@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitCompletion, User])],
  controllers: [HabitsController],
  providers: [HabitsService],
  exports: [HabitsService], // Export for potential integration with other modules
})
export class HabitsModule {} 