import { IsString, IsDateString, IsOptional, IsInt, Min, Max } from 'class-validator';

// CONTEXT: Manual partial type for PERMA entry updates
export class UpdatePermaEntryDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  positiveEmotion?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  engagement?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  relationships?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  meaning?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  accomplishment?: number;

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