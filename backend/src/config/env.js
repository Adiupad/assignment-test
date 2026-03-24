import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/migration_app',
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: Number(process.env.REDIS_PORT || 6379),
  socketServerUrl: process.env.SOCKET_SERVER_URL || 'http://localhost:4000'
};
