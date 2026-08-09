import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

import { CONFIG } from './config';
import { initSockets } from './sockets/queueSockets';

import authRoutes from './routes/authRoutes';
import queueRoutes from './routes/queueRoutes';
import roomRoutes from './routes/roomRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

const app = express();
const server = http.createServer(app);

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: CONFIG.CORS_ORIGIN,
    credentials: true,
  })
);

// ==========================================
// JSON BODY PARSER
// ==========================================

app.use(express.json());

// ==========================================
// SOCKET.IO
// ==========================================

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

initSockets(io);

// ==========================================
// API ROUTES
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/analytics', analyticsRoutes);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    service: 'Smart Healthcare Queue Engine',
  });
});

// ==========================================
// FRONTEND STATIC FILES
// ==========================================

// Docker production structure:
//
// /app
// ├── backend
// │   └── dist
// │       └── backend
// │           └── src
// │               └── server.js
// │
// └── frontend
//     └── dist
//         └── index.html
//
// process.cwd() is /app because the Dockerfile
// uses WORKDIR /app.

const frontendDistPath = path.join(
  process.cwd(),
  'frontend',
  'dist'
);

console.log('==========================================');
console.log('Frontend directory:', frontendDistPath);
console.log('==========================================');

// Serve frontend static files
app.use(express.static(frontendDistPath));

// ==========================================
// FRONTEND SPA FALLBACK
// ==========================================

app.get('*', (req, res, next) => {
  // Never intercept API requests
  if (req.path.startsWith('/api')) {
    return next();
  }

  // Never intercept Socket.IO requests
  if (req.path.startsWith('/socket.io')) {
    return next();
  }

  const indexPath = path.join(
    frontendDistPath,
    'index.html'
  );

  console.log('Serving frontend:', indexPath);

  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(
        '=========================================='
      );

      console.error(
        'ERROR: Could not find frontend index.html'
      );

      console.error(
        'Expected path:',
        indexPath
      );

      console.error(
        '=========================================='
      );

      res.status(404).send(
        'Frontend build not found. Expected: ' +
          indexPath
      );
    }
  });
});

// ==========================================
// START SERVER
// ==========================================

server.listen(CONFIG.PORT, () => {
  console.log('==========================================');
  console.log(
    `🚀 Smart Healthcare Server running on port ${CONFIG.PORT}`
  );
  console.log(
    `🌐 Frontend directory: ${frontendDistPath}`
  );
  console.log('==========================================');
});