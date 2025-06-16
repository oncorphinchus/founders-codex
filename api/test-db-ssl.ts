import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test script to verify SSL database connection for DigitalOcean deployment
 * Run with: npx ts-node test-db-ssl.ts
 */
const testDatabaseConnection = async () => {
  console.log('🧪 Testing database SSL connection...\n');

  const databaseUrl = process.env.DATABASE_URL;
  const sslMode = process.env.DB_SSL_MODE || 'require';
  const caCertificate = process.env.DB_CA_CERT;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔧 Configuration:');
  console.log(`- SSL Mode: ${sslMode}`);
  console.log(`- CA Certificate: ${caCertificate ? 'PROVIDED' : 'NOT PROVIDED'}`);
  console.log(`- Database URL: ${databaseUrl.replace(/:[^:@]*@/, ':***@')}`); // Hide password
  console.log('');

  // Configure SSL options similar to app.module.ts
  let sslOptions: any = false;
  
  if (sslMode !== 'disable') {
    sslOptions = {
      rejectUnauthorized: caCertificate ? true : false,
      checkServerIdentity: false,
    };
    
    if (caCertificate) {
      console.log('🔐 Using provided CA certificate for secure connection');
      sslOptions.ca = caCertificate;
    } else {
      console.log('⚠️  Using SSL without CA certificate verification');
    }
  } else {
    console.log('🚫 SSL disabled');
  }

  const dataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    ssl: sslOptions,
    synchronize: false,
    logging: false,
    extra: {
      connectionTimeoutMillis: 30000,
    },
  });

  try {
    console.log('🔄 Attempting database connection...');
    await dataSource.initialize();
    
    console.log('✅ Database connection successful!');
    console.log('🎉 SSL configuration is working properly');
    
    // Test a simple query
    const result = await dataSource.query('SELECT NOW() as current_time');
    console.log(`📅 Database time: ${result[0].current_time}`);
    
    await dataSource.destroy();
    console.log('🔌 Connection closed successfully');
    
  } catch (error: any) {
    console.error('❌ Database connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'Unknown'}`);
    
    if (error.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
      console.log('\n💡 Suggested solutions:');
      console.log('1. Add the CA certificate to DB_CA_CERT environment variable');
      console.log('2. Or temporarily use DB_SSL_MODE=require without DB_CA_CERT');
      console.log('3. Check that the certificate includes BEGIN/END markers');
    }
    
    process.exit(1);
  }
};

testDatabaseConnection().catch(console.error); 