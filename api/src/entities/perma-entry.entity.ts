import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';

// CONTEXT: Implements "Integrated Well-Being" principle by operationalizing
// Martin Seligman's PERMA model for systematic well-being tracking
@Entity('perma_entries')
@Index(['user', 'date'], { unique: true }) // Ensure one entry per user per day
export class PermaEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: false, nullable: false })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  // CONTEXT: The five pillars of Martin Seligman's PERMA model for flourishing
  // Each rated 1-5 to provide quantitative tracking of well-being dimensions

  @Column({ type: 'int' })
  positiveEmotion: number; // P - Joy, gratitude, serenity, interest, hope, pride, amusement, love

  @Column({ type: 'int' })
  engagement: number; // E - Flow, deep involvement, concentration, absorption

  @Column({ type: 'int' })
  relationships: number; // R - Love, intimacy, emotional support, social connections

  @Column({ type: 'int' })
  meaning: number; // M - Purpose, significance, coherence, belonging to something larger

  @Column({ type: 'int' })
  accomplishment: number; // A - Achievement, mastery, success, pride, satisfaction

  // CONTEXT: Optional gratitude entries for boosting positive emotion
  // Research by Robert Emmons shows gratitude practice significantly improves well-being
  @Column({ type: 'text', nullable: true })
  gratitudeEntry1?: string;

  @Column({ type: 'text', nullable: true })
  gratitudeEntry2?: string;

  @Column({ type: 'text', nullable: true })
  gratitudeEntry3?: string;

  // CONTEXT: Overall reflection helps identify patterns and triggers
  @Column({ type: 'text', nullable: true })
  dailyReflection?: string;

  @CreateDateColumn()
  createdAt: Date;

  // CONTEXT: Business logic for calculating well-being scores and trends
  static calculateOverallScore(positiveEmotion: number, engagement: number, relationships: number, meaning: number, accomplishment: number): number {
    return (positiveEmotion + engagement + relationships + meaning + accomplishment) / 5;
  }

  // CONTEXT: Identifies potential burnout patterns based on PERMA scores
  static detectBurnoutRisk(recentEntries: PermaEntry[]): boolean {
    // Implementation will analyze trends in the service layer
    // Low engagement + low positive emotion over time = burnout risk
    return false;
  }
} 