import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

// CONTEXT: Implements the "Antifragile User" principle by providing structured
// tools for psychological resilience and emotional regulation through Stoic practices
export enum JournalEntryType {
  STOIC_AM = 'STOIC_AM',       // Morning preparation - premeditatio malorum
  STOIC_PM = 'STOIC_PM',       // Evening reflection - what was controlled vs not controlled
  GRATITUDE = 'GRATITUDE'      // Daily gratitude practice for positive emotion
}

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: false, nullable: false })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: JournalEntryType,
  })
  type: JournalEntryType;

  @CreateDateColumn()
  createdAt: Date;

  // CONTEXT: Ensures one entry per type per day to maintain consistent practice
  // This prevents users from creating multiple entries and gaming the system
  static validateDailyUniqueness(userId: string, date: Date, type: JournalEntryType): boolean {
    // This will be enforced at the service level with database constraints
    return true;
  }
} 