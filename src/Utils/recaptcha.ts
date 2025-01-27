import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '';

export const verifyRecaptcha = async (recaptchaToken: string): Promise<boolean> => {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
        );
        
        const { success, score } = response.data;

        // Check if the verification was successful and the score is above the threshold
        return success && score >= 0.5;
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return false;
    }
};