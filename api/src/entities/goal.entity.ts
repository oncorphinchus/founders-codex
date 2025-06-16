import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';

// CONTEXT: Implements "The Practitioner-Scholar" principle by creating a hierarchical structure
// that enforces strategic alignment from 10-year vision down to daily atomic tasks
export enum GoalType {
  KEYSTONE = 'KEYSTONE',        // 10-year anchored goals
  ANNUAL = 'ANNUAL',           // Annual objectives
  QUARTERLY = 'QUARTERLY',     // Quarterly rocks
  WEEKLY = 'WEEKLY',           // Weekly sprints  
  DAILY_ATOMIC = 'DAILY_ATOMIC' // Daily atomic tasks
}

// CONTEXT: Embodies the "Language of Growth" principle - no negative states like "FAILED"
export enum GoalStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS', 
  COMPLETE = 'COMPLETE',
  LEARNING_IN_PROGRESS = 'LEARNING_IN_PROGRESS' // Replaces "failed" - reframes setbacks as learning opportunities
}

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: false, nullable: false })
  user: User;

  @Column({
    type: 'enum',
    enum: GoalType,
  })
  type: GoalType;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: GoalStatus,
    default: GoalStatus.NOT_STARTED,
  })
  status: GoalStatus;

  // CONTEXT: Self-referencing relationship enables the hierarchical "Vision-to-Action Funnel"
  // This enforces that every goal must serve a higher purpose (except Keystones)
  @Column({ nullable: true })
  parentId?: string;

  @ManyToOne(() => Goal, (goal) => goal.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: Goal;

  @OneToMany(() => Goal, (goal) => goal.parent)
  children: Goal[];

  // For Keystone goals - links to the specific week in the 90-year grid
  @Column({ nullable: true })
  weekId?: number;

  // SMART Goal attributes - enforces concrete, actionable planning
  @Column({ nullable: true })
  specificMeasure?: string; // How will success be measured?

  @Column({ type: 'date', nullable: true })
  targetDate?: Date;

  @Column({ type: 'boolean', default: false })
  isHypothesis: boolean; // Flags business experiments for validated learning

  // For hypothesis tracking - implements Build-Measure-Learn feedback loop
  @Column({ type: 'text', nullable: true })
  hypothesisTest?: string; // What specific action will test this?

  @Column({ nullable: true })
  hypothesisMetric?: string; // What metric defines success?

  @Column({ type: 'text', nullable: true })
  learnings?: string; // What was learned from the outcome?

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // CONTEXT: Business logic that enforces the philosophical hierarchy rules
  // Prevents the creation of "orphan" goals that don't serve a higher purpose
  static validateHierarchy(type: GoalType, parentType?: GoalType): boolean {
    const validParentMappings = {
      [GoalType.KEYSTONE]: null, // Keystones have no parent
      [GoalType.ANNUAL]: GoalType.KEYSTONE,
      [GoalType.QUARTERLY]: GoalType.ANNUAL,
      [GoalType.WEEKLY]: GoalType.QUARTERLY,
      [GoalType.DAILY_ATOMIC]: GoalType.WEEKLY,
    };

    return validParentMappings[type] === parentType;
  }
} 