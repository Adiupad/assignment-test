import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

export const MIGRATION_QUEUE = 'migration-queue';

export const migrationQueue = new Queue(MIGRATION_QUEUE, {
  connection: redisConnection
});
