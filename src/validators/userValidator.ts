import { User } from '../models/userModel';

export const validateUser = (user: User): string[] => {
    const errors: string[] = [];

    if (!user.name || typeof user.name !== 'string' || user.name.trim().length === 0) {
        errors.push('Name is required and must be a non-empty string.');
    } else if (user.name.length > 50) {
        errors.push('Name cannot be more than 50 characters.');
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!user.email || typeof user.email !== 'string' || !emailRegex.test(user.email)) {
        errors.push('Please add a valid email.');
    }

    if (!user.password || typeof user.password !== 'string' || user.password.length < 6) {
        errors.push('Password must be at least 6 characters.');
    }

    const validRoles = ['student', 'teacher'];
    if (!user.role || !validRoles.includes(user.role)) {
        errors.push('Role must be either "student" or "teacher".');
    }

    return errors;
};