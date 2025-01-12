import express from 'express';
import { register, login, forgotPassword } from '../controllers/authController';

const router = express.Router();

// Route to register a new user
router.post('/register', register);

// Route to log in a user
router.post('/login', login);

// Route to send password reset email
router.post('/forgot-password', forgotPassword);

export default router;
