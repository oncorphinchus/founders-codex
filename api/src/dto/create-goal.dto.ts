import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsUUID, IsNumber } from 'class-validator';
import { GoalType } from '../entities/goal.entity';

// CONTEXT: Enforces the "Vision-to-Action Funnel" principle by requiring parent linkage
// for all goals except Keystones, preventing strategic misalignment
export class CreateGoalDto {
  @IsEnum(GoalType)
  type: GoalType;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  // CONTEXT: Enforces hierarchy - parent required for all types except KEYSTONE
  @IsOptional()
  @IsUUID()
  parentId?: string;

  // For Keystone goals - anchors to specific week in 90-year grid
  @IsOptional()
  @IsNumber()
  weekId?: number;

  // SMART Goal attributes
  @IsOptional()
  @IsString()
  specificMeasure?: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  // Hypothesis tracking for validated learning
  @IsOptional()
  @IsBoolean()
  isHypothesis?: boolean;

  @IsOptional()
  @IsString()
  hypothesisTest?: string;

  @IsOptional()
  @IsString()
  hypothesisMetric?: string;
} 