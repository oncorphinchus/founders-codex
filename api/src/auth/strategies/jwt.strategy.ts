import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { User } from '../../entities/user.entity';

// CONTEXT: JWT authentication strategy for protected routes
// Validates JWT tokens and provides user context for requests
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret-change-in-production',
    });
  }

  // CONTEXT: Validates JWT payload and attaches user to request
  // Called for every protected route to establish user context
  async validate(payload: any): Promise<User> {
    const user = await this.authService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }
    
    return user;
  }
} 