import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// CONTEXT: Validates user login credentials for authentication
// Simple, secure login with email and password
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
} 