import { IsString, IsOptional, MaxLength } from 'class-validator';

// CONTEXT: Allows habit refinement while maintaining atomic habit principles
// Supports iterative improvement of habit design for better adherence
export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  cue?: string;
} 