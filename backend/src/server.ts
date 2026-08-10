import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
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

// CORS
app.use(
  cors({
    origin: CONFIG.CORS_ORIGIN,
    credentials: true,
  })
);

// Body Parser
app.use(express.json());

// Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

initSockets(io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    service: 'Smart Healthcare Queue Engine',
  });
});

// Robust Frontend Static Path Resolver
const potentialPaths = [
  path.join(process.cwd(), '../frontend/dist'),
  path.join(process.cwd(), 'frontend/dist'),
  path.join(__dirname, '../../frontend/dist'),
  path.join(__dirname, '../../../frontend/dist'),
  path.join(__dirname, '../frontend/dist')
];

const frontendDistPath = potentialPaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || potentialPaths[0];

console.log('==========================================');
console.log('Resolved Frontend directory:', frontendDistPath);
console.log('==========================================');

// Serve frontend static files
app.use(express.static(frontendDistPath));

// Frontend SPA Fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }

  const indexPath = path.join(frontendDistPath, 'index.html');

  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('ERROR: Could not find frontend index.html at', indexPath);
      res.status(404).send('Frontend build index.html not found. Path searched: ' + indexPath);
    }
  });
});

// Start Server
server.listen(CONFIG.PORT, () => {
  console.log('==========================================');
  console.log(`🚀 Smart Healthcare Server running on port ${CONFIG.PORT}`);
  console.log(`🌐 Frontend directory: ${frontendDistPath}`);
  console.log('==========================================');
});