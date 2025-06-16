import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, Min, Max } from 'class-validator';

// CONTEXT: DTOs implement "Integrated Well-Being" principle by enforcing
// proper validation for Martin Seligman's PERMA model tracking
export class CreatePermaEntryDto {
  @IsDateString()
  date: string;

  @IsInt()
  @Min(1)
  @Max(5)
  positiveEmotion: number;

  @IsInt()
  @Min(1)
  @Max(5)
  engagement: number;

  @IsInt()
  @Min(1)
  @Max(5)
  relationships: number;

  @IsInt()
  @Min(1)
  @Max(5)
  meaning: number;

  @IsInt()
  @Min(1)
  @Max(5)
  accomplishment: number;

  @IsOptional()
  @IsString()
  gratitudeEntry1?: string;

  @IsOptional()
  @IsString()
  gratitudeEntry2?: string;

  @IsOptional()
  @IsString()
  gratitudeEntry3?: string;

  @IsOptional()
  @IsString()
  dailyReflection?: string;
} 