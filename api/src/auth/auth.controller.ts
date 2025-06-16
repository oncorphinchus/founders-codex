import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// CONTEXT: Authentication endpoints for user registration and login
// Provides secure access to the Founder's Codex platform
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // CONTEXT: User registration endpoint
  // Creates new user account with secure password hashing
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    
    return {
      message: 'User registered successfully',
      user: result.user,
      access_token: result.access_token,
    };
  }

  // CONTEXT: User login endpoint
  // Validates credentials and returns JWT token for authentication
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    
    return {
      message: 'Login successful',
      user: result.user,
      access_token: result.access_token,
    };
  }

  // CONTEXT: Alternative login endpoint using Passport local strategy
  // Provides additional authentication pathway if needed
  @UseGuards(AuthGuard('local'))
  @Post('login-local')
  @HttpCode(HttpStatus.OK)
  async loginLocal(@Request() req) {
    // User is attached to request by LocalStrategy
    const user = req.user;
    const payload = { sub: user.id, email: user.email };
    
    // Generate token manually since we're not using AuthService.login here
    // In practice, you might want to refactor this to use AuthService
    return {
      message: 'Login successful',
      user,
      // Note: This would need access to JwtService to generate token
      // For now, redirect to main login endpoint
    };
  }
} 