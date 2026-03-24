# Database Migration App (MVP)

Minimal full-stack app for CSV -> PostgreSQL migration with real-time progress.

## Stack
- Backend: Node.js, Express, Multer, BullMQ, Redis, PostgreSQL, Socket.IO
- Worker: BullMQ worker with streaming CSV parsing
- Frontend: React + Vite + socket.io-client

## Folder Structure

```text
backend/
  src/
    config/
    queue/
    utils/
    server.js
    worker.js
  uploads/
  package.json
  .env.example
frontend/
  src/
    App.jsx
    main.jsx
    styles.css
  package.json
```

## Flow
Upload → Queue → Worker → DB Insert → WebSocket → UI update

## Prerequisites
- Node.js 18+
- PostgreSQL running locally
- Redis running locally

## Setup

### 1) PostgreSQL
Create a database (example):

```sql
CREATE DATABASE migration_app;
```

### 2) Backend

```bash
cd backend
cp .env.example .env
npm install
```

Update `.env` if needed:
- `DATABASE_URL`
- `REDIS_HOST` / `REDIS_PORT`
- `FRONTEND_URL`

### 3) Frontend

```bash
cd ../frontend
npm install
```

## Run Locally
Open 3 terminals:

### Terminal A: backend API + Socket.IO
```bash
cd backend
npm start
```

### Terminal B: BullMQ worker
```bash
cd backend
npm run worker
```

### Terminal C: React app
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Usage
1. Choose a `.csv` file.
2. Click **Start**.
3. Watch live `Rows inserted` updates.

## Notes
- CSV is parsed as a stream (`csv-parser`) to avoid loading whole file in memory.
- Worker creates a table dynamically from CSV header names (sanitized to SQL-safe identifiers).
- All generated columns are `TEXT` for MVP simplicity.
