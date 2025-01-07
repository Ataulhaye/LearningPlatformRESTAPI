import express, { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import User, { IUser } from '../models/User';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: IUser;
}

// Get current user profile
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (teacher only)
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 