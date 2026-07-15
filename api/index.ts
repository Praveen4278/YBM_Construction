import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../server/src/config/db';
import authRoutes from '../server/src/routes/auth';
import projectRoutes from '../server/src/routes/projects';
import testimonialRoutes from '../server/src/routes/testimonials';
import serviceRoutes from '../server/src/routes/services';
import submissionRoutes from '../server/src/routes/submissions';
import analyticsRoutes from '../server/src/routes/analytics';
import settingsRoutes from '../server/src/routes/settings';
import uploadRoutes from '../server/src/routes/upload';

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'YBM Construction API is operational' });
});

// Connect DB once on cold start
connectDB();

export default app;
