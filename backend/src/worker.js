import fs from 'node:fs';
import csv from 'csv-parser';
import { Worker } from 'bullmq';
import { io as socketClient } from 'socket.io-client';
import { dbPool } from './config/db.js';
import { env } from './config/env.js';
import { redisConnection } from './config/redis.js';
import { MIGRATION_QUEUE } from './queue/migrationQueue.js';
import { quoteIdentifier, sanitizeIdentifier } from './utils/sql.js';

function makeTableName(fileName, jobId) {
  const base = fileName.replace(/\.csv$/i, '');
  return sanitizeIdentifier(`import_${base}_${jobId}`);
}

async function processCsvJob(job) {
  const socket = socketClient(env.socketServerUrl, {
    transports: ['websocket'],
    reconnection: true
  });

  const { filePath, fileName } = job.data;
  const tableName = makeTableName(fileName, job.id);

  let headerPairs = [];
  let insertedCount = 0;
  const client = await dbPool.connect();

  try {
    await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath).pipe(csv());

      stream.on('headers', async (rawHeaders) => {
        try {
          headerPairs = rawHeaders.map((originalHeader) => ({
            original: originalHeader,
            sanitized: sanitizeIdentifier(originalHeader)
          }));

          const columnsSql = headerPairs
            .map(({ sanitized }) => `${quoteIdentifier(sanitized)} TEXT`)
            .join(', ');

          await client.query(
            `CREATE TABLE IF NOT EXISTS ${quoteIdentifier(tableName)} (${columnsSql});`
          );
        } catch (error) {
          reject(error);
        }
      });

      stream.on('data', (row) => {
        stream.pause();

        const values = headerPairs.map(({ original }) => row[original] ?? null);
        const placeholders = values.map((_, idx) => `$${idx + 1}`).join(', ');
        const columns = headerPairs
          .map(({ sanitized }) => quoteIdentifier(sanitized))
          .join(', ');

        client
          .query(
            `INSERT INTO ${quoteIdentifier(tableName)} (${columns}) VALUES (${placeholders});`,
            values
          )
          .then(() => {
            insertedCount += 1;
            socket.emit('worker-progress', {
              jobId: job.id,
              insertedCount,
              done: false
            });
            stream.resume();
          })
          .catch((err) => reject(err));
      });

      stream.on('end', () => resolve());
      stream.on('error', (error) => reject(error));
    });

    socket.emit('worker-progress', {
      jobId: job.id,
      insertedCount,
      done: true
    });
  } catch (error) {
    socket.emit('worker-progress', {
      jobId: job.id,
      insertedCount,
      done: true,
      error: error.message
    });
    throw error;
  } finally {
    client.release();
    socket.close();
  }
}

const worker = new Worker(MIGRATION_QUEUE, processCsvJob, {
  connection: redisConnection
});

worker.on('failed', (job, error) => {
  // eslint-disable-next-line no-console
  console.error(`Job ${job?.id} failed:`, error.message);
});

// eslint-disable-next-line no-console
console.log('Migration worker is running.');
