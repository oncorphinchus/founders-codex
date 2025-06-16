import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { Habit } from './entities/habit.entity';
import { HabitCompletion } from './entities/habit-completion.entity';
import { User } from './entities/user.entity';

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

let sslOptions: any = false;
if (isProduction && process.env.DB_SSL_MODE !== 'disable') {
  sslOptions = {
    rejectUnauthorized: false,
    checkServerIdentity: false,
  };
  if (process.env.DB_CA_CERT) {
    sslOptions.ca = process.env.DB_CA_CERT;
  }
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Goal, Habit, HabitCompletion, User],
  migrations: ['src/migrations/*.{ts,js}'],
  synchronize: false,
  ssl: sslOptions,
  logging: false,
  extra: {
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 10,
  },
});

export default AppDataSource; 