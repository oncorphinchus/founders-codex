/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // CONTEXT: Diagnostic logging for DigitalOcean deployment debugging
  console.log('=== ENVIRONMENT VARIABLE VERIFICATION ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('DB_SSL_MODE:', process.env.DB_SSL_MODE);
  console.log('--- DB_CA_CERT Verification ---');
  if (process.env.DB_CA_CERT) {
    console.log('DB_CA_CERT length:', process.env.DB_CA_CERT.length);
    console.log('DB_CA_CERT starts with:', process.env.DB_CA_CERT.substring(0, 50) + '...');
    console.log('DB_CA_CERT ends with:', '...' + process.env.DB_CA_CERT.substring(process.env.DB_CA_CERT.length - 50));
    console.log('Contains BEGIN CERTIFICATE:', process.env.DB_CA_CERT.includes('-----BEGIN CERTIFICATE-----'));
    console.log('Contains END CERTIFICATE:', process.env.DB_CA_CERT.includes('-----END CERTIFICATE-----'));
  } else {
    console.log('DB_CA_CERT: MISSING OR EMPTY');
  }
  console.log('--- End DB_CA_CERT Verification ---');
  console.log('=== END ENVIRONMENT VERIFICATION ===\n');

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
