import bcrypt from 'bcrypt';

export interface User {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher';
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
}

/**
 * Hash the user's password
 * @param password - Plain text password
 * @returns Promise<string> - Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

/**
 * Compare plain text password with hashed password
 * @param inputPassword - Plain text password entered by the user
 * @param hashedPassword - Hashed password stored in the database
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export const comparePassword = async (
    inputPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(inputPassword, hashedPassword);
};
