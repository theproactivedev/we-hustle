import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import type { NextFunction, Request, Response } from 'express';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let token = null;
    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]; 
    } else if(req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }                                                                                                         

    if(!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: (decoded as { id: string }).id },
        });

        if(!user) {
            res.status(401).json({ message: 'Unauthorized: User no longer exists' });
        }

        console.log('Authenticated user:', user);

        // req.user = user; // Attach user to request object
        next();
    } catch(error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Internal Server Error' });
    }
}

export default authMiddleware;