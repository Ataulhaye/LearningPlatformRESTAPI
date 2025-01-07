import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';


dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to School Learning Platform API' });
});

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_platform';

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
🚀 Server is running on port ${PORT}
📚 API Documentation: http://localhost:${PORT}
  `);
}); 