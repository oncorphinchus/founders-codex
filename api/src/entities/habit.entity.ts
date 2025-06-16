import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

// CONTEXT: Implements "The 1% Better System" principle from James Clear's Atomic Habits
// Each habit is designed to be "too small to fail" while building compound improvement
@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // In a real app, this would be a foreign key to a User entity

  @Column()
  title: string; // e.g., "Read one page", "Write 50 words", "Do one push-up"

  @Column({ type: 'text', nullable: true })
  description?: string;

  // CONTEXT: Implements "Habit Stacking" technique from James Clear
  // Links new habit to existing routine/event for reliable cue
  @Column({ type: 'text', nullable: true })
  cue?: string; // e.g., "After my morning coffee", "When I sit at my desk"

  // CONTEXT: Tracks when habit was created for analytics and motivation
  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // CONTEXT: Relationship to completion records for streak calculation
  @OneToMany('HabitCompletion', 'habit')
  completions: any[];

  // CONTEXT: Virtual properties for UI display (calculated in service)
  currentStreak?: number;
  longestStreak?: number;
  completionRate?: number; // Percentage over last 30 days
  isCompletedToday?: boolean;
} 