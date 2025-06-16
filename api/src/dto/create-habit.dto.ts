import { IsString, IsOptional, MaxLength } from 'class-validator';

// CONTEXT: Enforces "atomic habits" principle by encouraging small, specific actions
// Guides users toward "too small to fail" habits for sustainable improvement
export class CreateHabitDto {
  @IsString()
  @MaxLength(100)
  title: string; // e.g., "Read one page", "Write 50 words", "Do one push-up"

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  // CONTEXT: Implements "Habit Stacking" - linking new habits to existing routines
  // Creates reliable cues for automatic execution (Cue-Routine-Reward loop)
  @IsOptional()
  @IsString()
  @MaxLength(200)
  cue?: string; // e.g., "After my morning coffee", "When I sit at my desk"
} 