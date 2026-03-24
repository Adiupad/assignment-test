import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const dbPool = new Pool({
  connectionString: env.databaseUrl
});
