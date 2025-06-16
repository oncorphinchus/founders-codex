import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString, IsDateString } from 'class-validator';

// CONTEXT: Validates user registration data with strong password requirements
// Supports optional profile information for personalized experience
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string; // Used for 90-year calendar calculation
} 