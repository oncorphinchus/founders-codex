import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// CONTEXT: JWT authentication guard for protecting routes
// Ensures only authenticated users can access protected endpoints
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {} 