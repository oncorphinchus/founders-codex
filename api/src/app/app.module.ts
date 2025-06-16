import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoalsModule } from '../modules/goals.module';
import { HabitsModule } from '../modules/habits.module';
import { Goal } from '../entities/goal.entity';
import { Habit } from '../entities/habit.entity';
import { HabitCompletion } from '../entities/habit-completion.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // CONTEXT: Support both DATABASE_URL (cloud standard) and individual DB vars (local dev)
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // Production: Use DATABASE_URL (Digital Ocean, Heroku, etc.)
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [Goal, Habit, HabitCompletion],
            synchronize: configService.get('NODE_ENV') !== 'production', // Safe for production
            ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
            logging: configService.get('NODE_ENV') === 'development',
          };
        } else {
          // Development: Use individual environment variables
          return {
            type: 'postgres',
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get('DB_PORT', 5432),
            username: configService.get('DB_USERNAME', 'postgres'),
            password: configService.get('DB_PASSWORD', 'password'),
            database: configService.get('DB_NAME', 'founders_codex'),
            entities: [Goal, Habit, HabitCompletion],
            synchronize: true, // Only for development
            ssl: false,
            logging: true,
          };
        }
      },
      inject: [ConfigService],
    }),
    GoalsModule, // CONTEXT: Integrates the Goal Stack system into the app
    HabitsModule, // CONTEXT: Integrates "The 1% Better System" for habit formation
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
