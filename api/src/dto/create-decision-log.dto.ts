import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, Min, Max } from 'class-validator';

// CONTEXT: DTOs enforce "Language of Growth" and proper data validation
// for the Decision Journal component of the "Practitioner-Scholar" system
export class CreateDecisionLogDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  decision: string;

  @IsString()
  @IsNotEmpty()
  expectedOutcome: string;

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