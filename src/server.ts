import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {getMongoDBInstance} from './mongodal/database';
import authRoutes from './routes/authRoutes';

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || 'localhost';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to School Learning Platform API' });
});


// Routes
app.use('/api/auth', authRoutes);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await getMongoDBInstance();
    app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
};

startServer();