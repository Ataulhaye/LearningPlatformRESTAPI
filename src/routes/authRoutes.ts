import express from 'express';
import { register, login, forgotPassword, resetPassword, getUserById } from '../controllers/authController';

const router = express.Router();

// Route to register a new user
router.post('/register', register);

// Route to log in a user
router.post('/login', login);

// Route to send password reset email
router.post('/forgot-password', forgotPassword);


router.post('/reset-password/:token', resetPassword); 

router.get('/user/:id', getUserById); 


export default router;
