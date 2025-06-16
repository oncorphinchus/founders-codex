import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

// CONTEXT: Tracks individual habit completion events for "Visual Habit Chains"
// Enables streak calculation and heat map visualization to "Make it satisfying"
@Entity('habit_completions')
export class HabitCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  habitId: string;

  // CONTEXT: Date-only field for daily tracking (no time component)
  // Ensures one completion per day maximum for proper streak calculation
  @Column({ type: 'date' })
  completionDate: Date;

  // CONTEXT: Relationship back to the habit for efficient queries
  // Using string reference to avoid circular imports
  @ManyToOne('Habit', 'completions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habitId' })
  habit: any;
} 