import jwt from 'jsonwebtoken';
import type { Response } from "express";

const generateToken = (res: Response, userId: string) => {
    const payload = { id: userId };
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict', // Adjust based on your needs
        maxAge: 1000 * 60 * 60 // 1 hour
    })
    return token;
}

export {
    generateToken
}