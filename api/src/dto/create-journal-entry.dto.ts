import { IsEnum, IsString, IsNotEmpty, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { JournalEntryType } from '../entities/journal-entry.entity';

export class CreateJournalEntryDto {
  @IsEnum(JournalEntryType)
  @IsNotEmpty()
  type: JournalEntryType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000, { message: 'Journal entry content must not exceed 10,000 characters' })
  content: string;

  @IsOptional()
  @IsDateString()
  date?: string; // ISO date string, will be converted to Date in service
} 