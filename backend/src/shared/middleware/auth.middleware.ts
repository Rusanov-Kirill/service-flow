import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { authRepository } from '../../modules/auth/auth.repository';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ success: false, error: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ success: false, error: 'No token provided' });
            return;
        }

        const decoded = verifyAccessToken(token);

        const user = await authRepository.getUserById(decoded.userId);
        if (!user) {
            res.status(401).json({ success: false, error: 'User not found' });
            return;
        }

        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
};