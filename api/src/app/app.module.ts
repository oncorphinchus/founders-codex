import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoalsModule } from '../modules/goals.module';
import { HabitsModule } from '../modules/habits.module';
import { AuthModule } from '../auth/auth.module';
import { JournalModule } from '../modules/journal.module';
import { DecisionLogsModule } from '../modules/decision-logs.module';
import { PermaModule } from '../modules/perma.module';
import { Goal } from '../entities/goal.entity';
import { Habit } from '../entities/habit.entity';
import { HabitCompletion } from '../entities/habit-completion.entity';
import { User } from '../entities/user.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { DecisionLog } from '../entities/decision-log.entity';
import { PermaEntry } from '../entities/perma-entry.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'], // Check both api/.env and parent .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // CONTEXT: Explicit development-first database configuration to avoid SSL issues
        const nodeEnv = configService.get('NODE_ENV') || 'development';
        const isProduction = nodeEnv === 'production';
        const databaseUrl = configService.get('DATABASE_URL');
        
        console.log('🔧 Database Configuration:');
        console.log('NODE_ENV:', nodeEnv);
        console.log('Is Production:', isProduction);
        console.log('DATABASE_URL exists:', !!databaseUrl);
        
                 // CONTEXT: Force local development configuration to prevent SSL errors
         if (!isProduction) {
           const config = {
             type: 'postgres' as const,
             host: 'localhost',
             port: 5432,
             username: 'phish',
             password: '',
             database: 'founders_codex',
             entities: [Goal, Habit, HabitCompletion, User, JournalEntry, DecisionLog, PermaEntry],
             synchronize: true, // Safe for development
             logging: false, // Disable logging for cleaner output
           };
           console.log('📊 Using PostgreSQL local development database');
           return config;
        } else {
          // CONTEXT: Production configuration for DigitalOcean App Platform + Managed PostgreSQL
          // Handles SSL certificate requirements for managed database connections
          const sslConfig = configService.get('DB_SSL_MODE') || process.env.DB_SSL_MODE || 'require';
          
          // CONTEXT: Try ConfigService first, fallback to direct process.env access
          // Some deployment platforms may have issues with ConfigService reading multiline values
          let caCertificate = configService.get('DB_CA_CERT');
          if (!caCertificate && process.env.DB_CA_CERT) {
            console.log('⚠️  ConfigService couldn\'t read DB_CA_CERT, using direct process.env access');
            caCertificate = process.env.DB_CA_CERT;
          }
          
          // CONTEXT: Additional diagnostic logging for SSL certificate debugging
          console.log('🔍 SSL Certificate Debug Info:');
          console.log('- sslConfig:', sslConfig);
          console.log('- caCertificate from ConfigService:', !!configService.get('DB_CA_CERT'));
          console.log('- caCertificate from process.env:', !!process.env.DB_CA_CERT);
          console.log('- Final caCertificate exists:', !!caCertificate);
          if (caCertificate) {
            console.log('- Certificate length:', caCertificate.length);
            console.log('- Certificate preview:', caCertificate.substring(0, 100) + '...');
          }
          
          let sslOptions: any = false;
          
          if (sslConfig !== 'disable') {
            // CONTEXT: Simplified SSL configuration that works with NODE_TLS_REJECT_UNAUTHORIZED
            // The global environment variable handles certificate validation bypass
            sslOptions = {
              rejectUnauthorized: false, // Always false, global env var handles this
              checkServerIdentity: false, // Disable hostname verification
            };
            
            // CONTEXT: Only add CA certificate if available, but don't rely on it for validation
            if (caCertificate) {
              const isValidCert = caCertificate.includes('-----BEGIN CERTIFICATE-----') && 
                                 caCertificate.includes('-----END CERTIFICATE-----');
              
              if (isValidCert) {
                console.log('🔐 Using CA certificate (validation bypassed via NODE_TLS_REJECT_UNAUTHORIZED)');
                sslOptions.ca = caCertificate;
              } else {
                console.log('❌ CA certificate is malformed, proceeding without it');
              }
            }
            
            console.log('🔓 SSL enabled with relaxed validation for DigitalOcean compatibility');
          }

          const config = {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [Goal, Habit, HabitCompletion, User, JournalEntry, DecisionLog, PermaEntry],
            synchronize: false, // Never auto-sync in production
            ssl: sslOptions,
            logging: false,
            // CONTEXT: Additional connection options for DigitalOcean compatibility
            extra: {
              connectionTimeoutMillis: 30000,
              idleTimeoutMillis: 30000,
              max: 10, // Maximum pool size
            },
          };
          
          console.log('🏭 Using production database config for DigitalOcean:', {
            ssl: sslOptions !== false ? 'enabled' : 'disabled',
            hasCaCert: !!caCertificate,
            sslMode: sslConfig,
          });
          
          return config;
        }
      },
      inject: [ConfigService],
    }),
    AuthModule, // CONTEXT: Enables secure multi-tenant authentication
    GoalsModule, // CONTEXT: Integrates the Goal Stack system into the app
    HabitsModule, // CONTEXT: Integrates "The 1% Better System" for habit formation
    JournalModule,
    DecisionLogsModule,
    PermaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
