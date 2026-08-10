import express from 'express';
import cors from 'cors';
import authRoutes from '../backend/src/routes/authRoutes';
import queueRoutes from '../backend/src/routes/queueRoutes';
import roomRoutes from '../backend/src/routes/roomRoutes';
import analyticsRoutes from '../backend/src/routes/analyticsRoutes';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), service: 'CareQueue AI Vercel Serverless Engine' });
});

// Global Serverless Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Vercel Serverless Function Error:', err);
  res.status(500).json({ message: err.message || 'Serverless function error handled' });
});

export default app;
