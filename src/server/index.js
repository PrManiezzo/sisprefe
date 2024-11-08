import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import issuesRoutes from './routes/issues.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});