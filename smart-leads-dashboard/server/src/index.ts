import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
let dbConnection: Promise<void> | null = null;

const ensureDBConnection = (): Promise<void> => {
  if (!dbConnection) {
    dbConnection = connectDB();
  }
  return dbConnection;
};

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Smart Leads API is running' });
});

app.use(async (_req, _res, next) => {
  try {
    await ensureDBConnection();
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;
