import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../Utils/email';
import { getMongoDBInstance } from '../mongodal/database';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { User } from '../models/userModel';
import { validateUser } from '../validators/userValidator';
import { verifyRecaptcha } from '../Utils/recaptcha';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'some-secret-key';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '5000';
const UIPORT = process.env.UIPORT || '3000';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {

    const { name, email, password, role, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
        res.status(400).json({ message: 'Invalid reCAPTCHA' });
        return;
    }

    let newUser: User = { name, email, password, role: role || 'student' };

    // Validate user data
    const validationErrors = validateUser(newUser);
    if (validationErrors.length > 0) {
        res.status(400).json({ message: 'Validation errors', errors: validationErrors });
        return;
    }

    try {
        const db = await getMongoDBInstance();
        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        newUser.password = hashedPassword;
    
        await db.collection('users').insertOne(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: (error as Error).message });
    }
};

// Log in an existing user
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
        res.status(400).json({ message: 'Invalid reCAPTCHA' });
        return;
    }

    try {
        const db = await getMongoDBInstance();
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
    }
};

// Handle forgot password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
        res.status(400).json({ message: 'Invalid reCAPTCHA' });
        return;
    }

    try {
        const db = await getMongoDBInstance();
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });

        let PROTOCOL = 'http';
        if(req.secure){
            PROTOCOL = 'https';
        }

        const resetLink = `${PROTOCOL}://${HOST}:${UIPORT}/reset-password/${resetToken}`;

        await sendEmail(email, 'Password Reset', `Click here to reset your password: ${resetLink}`);

        res.json({ message: 'Password reset link sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending password reset email', error: (error as Error).message });
    }
};

// Handle reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;
    const { newPassword, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
        res.status(400).json({ message: 'Invalid reCAPTCHA' });
        return;
    }
    
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const db = await getMongoDBInstance();
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: (error as Error).message });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const {id}  = req.params;

    try {
        const db = await getMongoDBInstance();
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: (error as Error).message });
    }
};
