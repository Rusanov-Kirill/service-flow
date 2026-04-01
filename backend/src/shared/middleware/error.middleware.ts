import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(`[ERROR] ${err.message}`, err.stack);

    if (err.name === 'ZodError') {
        const message = err.errors?.[0]?.message || 'Validation error';
        res.status(400).json({
            success: false,
            error: message
        });
        return;
    }

    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            error: 'Token expired'
        });
        return;
    }

    if (err.message === 'User already exists') {
        res.status(409).json({
            success: false,
            error: err.message
        });
        return;
    }

    if (err.message === 'Invalid credentials') {
        res.status(401).json({
            success: false,
            error: err.message
        });
        return;
    }

    if (err.message === 'Please verify your email first') {
        res.status(403).json({
            success: false,
            error: err.message
        });
        return;
    }

    if (err.message === 'Invalid refresh token' || err.message === 'Refresh token expired') {
        res.status(401).json({
            success: false,
            error: err.message
        });
        return;
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal server error'
    });
};