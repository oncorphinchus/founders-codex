/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

// CONTEXT: Critical SSL bypass for DigitalOcean managed database compatibility
// This must happen before any database connections are attempted
if (process.env.NODE_ENV === 'production') {
  console.log('🚨 Production environment detected - applying SSL certificate workarounds for DigitalOcean managed database');
  // Disable Node.js SSL verification globally for database connections
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  // Additional SSL environment variables for better compatibility
  process.env.PGSSLMODE = 'prefer'; // Use SSL if available, but don't require verification
}

console.log('=== ENVIRONMENT VARIABLE VERIFICATION ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DB_SSL_MODE:', process.env.DB_SSL_MODE);
if (process.env.NODE_ENV === 'production') {
  console.log('NODE_TLS_REJECT_UNAUTHORIZED:', process.env.NODE_TLS_REJECT_UNAUTHORIZED);
  console.log('PGSSLMODE:', process.env.PGSSLMODE);
}
console.log('--- DB_CA_CERT Verification ---');
if (process.env.DB_CA_CERT) {
  console.log('DB_CA_CERT length:', process.env.DB_CA_CERT.length);
  console.log('DB_CA_CERT starts with:', process.env.DB_CA_CERT.substring(0, 29));
  console.log(process.env.DB_CA_CERT.substring(29, 100) + '...');
  console.log('DB_CA_CERT ends with:', process.env.DB_CA_CERT.substring(process.env.DB_CA_CERT.length - 50));
  console.log('Contains BEGIN CERTIFICATE:', process.env.DB_CA_CERT.includes('-----BEGIN CERTIFICATE-----'));
  console.log('Contains END CERTIFICATE:', process.env.DB_CA_CERT.includes('-----END CERTIFICATE-----'));
} else {
  console.log('DB_CA_CERT: not set');
}
console.log('--- End DB_CA_CERT Verification ---');
console.log('=== END ENVIRONMENT VERIFICATION ===');
console.log('');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CONTEXT: Add a root route before setting global prefix to handle "/" requests
  app.getHttpAdapter().get('/', (req: any, res: any) => {
    res.json({
      message: 'Welcome to The Founder\'s Codex API',
      note: 'This is a RESTful API. Please access endpoints at /api/*',
      availableEndpoints: {
        'API Base': '/api',
        'Health Check': '/api/health',
        'Goals System': '/api/goals', 
        'Habits System': '/api/habits'
      },
      philosophy: 'The 1% Better System - Operationalizing behavioral psychology for founders',
      documentation: 'Visit /api for detailed endpoint information'
    });
  });
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
