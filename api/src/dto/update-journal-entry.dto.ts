import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateJournalEntryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000, { message: 'Journal entry content must not exceed 10,000 characters' })
  content: string;
} 