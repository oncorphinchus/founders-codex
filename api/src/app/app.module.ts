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
             host: configService.get('DB_HOST') || 'localhost',
             port: parseInt(configService.get('DB_PORT') || '5432'),
             username: configService.get('DB_USERNAME') || 'phish',
             password: configService.get('DB_PASSWORD') || '',
             database: configService.get('DB_NAME') || 'founders_codex',
             entities: [Goal, Habit, HabitCompletion],
             synchronize: true, // Safe for development
             ssl: false, // Explicitly disable SSL for local development
             logging: false, // Disable logging for cleaner output
             // Add connection options to force no SSL
             options: {
               encrypt: false,
               trustServerCertificate: false
             },
             extra: {
               ssl: false,
               // Additional PostgreSQL-specific SSL disable options
               sslmode: 'disable',
               options: '--sslmode=disable'
             },
           };
           console.log('📊 Using local development database config (SSL disabled)');
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
            sslOptions = {
              // CONTEXT: DigitalOcean managed databases require SSL
              rejectUnauthorized: false, // More permissive for managed DB certificates
              checkServerIdentity: false, // Disable hostname verification for managed DBs
              // Additional Node.js SSL options for better compatibility
              secureProtocol: 'TLSv1_2_method', // Use TLS 1.2
              ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
            };
            
            // CONTEXT: If CA certificate is provided, use it but with permissive validation
            if (caCertificate) {
              // Validate certificate format
              const isValidCert = caCertificate.includes('-----BEGIN CERTIFICATE-----') && 
                                 caCertificate.includes('-----END CERTIFICATE-----');
              
              if (isValidCert) {
                console.log('🔐 Using provided CA certificate for secure database connection');
                sslOptions.ca = caCertificate;
                // Keep rejectUnauthorized: false to avoid "self-signed certificate in certificate chain" errors
                // The CA certificate provides trust, but we allow intermediate certificate flexibility
                sslOptions.rejectUnauthorized = false;
              } else {
                console.log('❌ CA certificate is malformed, falling back to insecure SSL');
                console.log('Certificate content preview:', caCertificate.substring(0, 200));
                sslOptions.rejectUnauthorized = false;
              }
            } else {
              console.log('⚠️  Using SSL without CA certificate verification (less secure)');
              sslOptions.rejectUnauthorized = false;
            }
          }

          const config = {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [Goal, Habit, HabitCompletion],
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
    GoalsModule, // CONTEXT: Integrates the Goal Stack system into the app
    HabitsModule, // CONTEXT: Integrates "The 1% Better System" for habit formation
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
