import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';

// Route Imports
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import testimonialRoutes from './routes/testimonials';
import serviceRoutes from './routes/services';
import submissionRoutes from './routes/submissions';
import analyticsRoutes from './routes/analytics';
import settingsRoutes from './routes/settings';
import uploadRoutes from './routes/upload';

// Load config variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS — allow localhost in dev and Vercel domain in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:5173', 'http://127.0.0.1:5173',
      'http://localhost:5174', 'http://127.0.0.1:5174',
      'http://localhost:5175', 'http://127.0.0.1:5175',
      'http://localhost:5176', 'http://127.0.0.1:5176'
    ];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static public assets from root directory (brochures, logos, photos)
const rootDir = path.resolve(process.cwd(), '..');
app.use('/static-assets', express.static(rootDir));

// Bind Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'YBM Construction backend is operational' });
});

// Export app for Vercel serverless
export default app;

// Start Server & Connect Database (only when run directly, not in serverless)
if (process.env.VERCEL !== '1') {
  const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  };
  startServer();
}
