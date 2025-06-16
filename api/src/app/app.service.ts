import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string; endpoints: string[]; philosophy: string } {
    return { 
      message: 'Welcome to The Founder\'s Codex API',
      endpoints: [
        'GET /api - This message',
        'GET /api/health - Health check', 
        'GET /api/goals - Goal Stack system',
        'GET /api/habits - Habit Engine system'
      ],
      philosophy: 'Operationalizing principles from behavioral psychology and business strategy into a practical personal development system.'
    };
  }
}
