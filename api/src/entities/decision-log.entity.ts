import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

// CONTEXT: Implements the "Practitioner-Scholar" principle by systematizing
// the collection of decision data to create an unbiased feedback loop on judgment quality
@Entity('decision_logs')
export class DecisionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: false, nullable: false })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  decision: string;

  @Column({ type: 'text' })
  expectedOutcome: string;

  @Column({ type: 'text', nullable: true })
  actualOutcome?: string;

  @Column({ type: 'text', nullable: true })
  lessonsLearned?: string;

  // CONTEXT: Emotional state tracking helps identify decision patterns
  // Research shows emotions significantly impact decision quality
  @Column({ nullable: true })
  emotionalState?: string;

  // CONTEXT: Confidence tracking helps calibrate overconfidence bias
  // Users can learn to better assess their prediction accuracy
  @Column({ type: 'int', nullable: true })
  confidenceLevel?: number; // 1-10 scale

  // CONTEXT: Review scheduling helps ensure decisions are actually revisited
  // Many people make decisions but never evaluate their accuracy
  @Column({ type: 'date', nullable: true })
  reviewDate?: Date;

  @Column({ type: 'boolean', default: false })
  isReviewed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // CONTEXT: Business logic for calculating decision quality scores
  // Helps users identify patterns in their decision-making
  static calculateQualityScore(expectedOutcome: string, actualOutcome: string, confidenceLevel: number): number {
    // This will be implemented in the service layer
    // Higher scores for accurate predictions with appropriate confidence
    return 0;
  }
} 