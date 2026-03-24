import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import { migrationQueue } from './queue/migrationQueue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${unique}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const app = express();
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: env.frontendUrl
  }
});

io.on('connection', (socket) => {
  socket.on('join-job', (jobId) => {
    socket.join(`job:${jobId}`);
  });

  socket.on('worker-progress', ({ jobId, insertedCount, done, error }) => {
    io.to(`job:${jobId}`).emit('job-progress', { jobId, insertedCount, done, error });
  });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file is required.' });
  }

  const job = await migrationQueue.add('process-csv', {
    filePath: req.file.path,
    fileName: req.file.originalname
  });

  return res.status(201).json({ jobId: job.id });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

httpServer.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${env.port}`);
});
