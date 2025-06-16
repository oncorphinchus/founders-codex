import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { GoalStatus } from '../entities/goal.entity';

// CONTEXT: Implements "Language of Growth" principle in status updates
// Never allows setting status to negative states - failed goals become "LEARNING_IN_PROGRESS"
export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;

  @IsOptional()
  @IsString()
  specificMeasure?: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsOptional()
  @IsBoolean()
  isHypothesis?: boolean;

  @IsOptional()
  @IsString()
  hypothesisTest?: string;

  @IsOptional()
  @IsString()
  hypothesisMetric?: string;

  // CONTEXT: Captures learnings when goals transition to "LEARNING_IN_PROGRESS"
  // Operationalizes the Antifragile principle of gaining from setbacks
  @IsOptional()
  @IsString()
  learnings?: string;
} 