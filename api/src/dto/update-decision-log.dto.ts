import { IsString, IsDateString, IsOptional, IsInt, Min, Max } from 'class-validator';

// CONTEXT: Manual partial type for decision log updates
export class UpdateDecisionLogDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  decision?: string;

  @IsOptional()
  @IsString()
  expectedOutcome?: string;

  @IsOptional()
  @IsString()
  actualOutcome?: string;

  @IsOptional()
  @IsString()
  lessonsLearned?: string;

  @IsOptional()
  @IsString()
  emotionalState?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  confidenceLevel?: number;

  @IsOptional()
  @IsDateString()
  reviewDate?: string;
} 