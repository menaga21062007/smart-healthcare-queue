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

export default app;
