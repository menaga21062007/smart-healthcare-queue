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

const frontendDistPath = path.join(__dirname, '../../frontend/dist');

app.use(express.static(frontendDistPath));

// ==========================================
// FRONTEND SPA FALLBACK
// ==========================================

app.get('*', (req, res, next) => {
  // Don't intercept API or Socket.IO requests
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/socket.io')
  ) {
    return next();
  }

  res.sendFile(
    path.join(frontendDistPath, 'index.html'),
    (err) => {
      if (err) {
        res
          .status(404)
          .send(
            'CareQueue AI API Server active. Build frontend dist to view UI.'
          );
      }
    }
  );
});

// ==========================================
// START SERVER
// ==========================================

server.listen(CONFIG.PORT, () => {
  console.log(
    `🚀 Smart Healthcare Server running on port ${CONFIG.PORT}`
  );
});