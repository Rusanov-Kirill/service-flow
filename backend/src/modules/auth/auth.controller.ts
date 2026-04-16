import { Request, Response } from 'express';
// import { config } from '../../shared/config'
import { userRepository } from '../user/user.repository';
import { authService } from './auth.service';
import { registerSchema, loginSchema } from './auth.validation';

export const authController = {
    register: async (req: Request, res: Response) => {
        try {
            const validatedData = registerSchema.parse(req.body);
            const result = await authService.register(validatedData);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(201).json({
                success: true,
                data: {
                    accessToken: result.accessToken,
                    user: result.user
                }
            });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                const message = error.errors?.[0]?.message || 'Validation error';
                res.status(400).json({
                    success: false,
                    error: message
                });
                return;
            }

            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await authService.login(validatedData);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({
                success: true,
                data: {
                    accessToken: result.accessToken,
                    user: result.user
                }
            });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({
                    success: false,
                    error: error?.errors[0]?.message
                });
                return;
            }
            res.status(401).json({
                success: false,
                error: error.message
            });
        }
    },

    refresh: async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken) {
                res.status(401).json({ success: false, error: 'No refresh token' });
                return;
            }

            const { accessToken } = await authService.refresh(refreshToken);
            res.json({ success: true, data: { accessToken } });
        } catch (error: any) {
            res.status(401).json({ success: false, error: error.message });
        }
    },

    logout: async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies['refreshToken'] || req.body.refreshToken;;
            if (refreshToken) {
                await authService.logout(refreshToken);
            }

            res.clearCookie('refreshToken');
            res.json({ success: true, message: 'Logged out' });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    me: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            if (!user) {
                res.status(401).json({ success: false, error: 'Not authenticated' });
                return;
            }

            const companies = await userRepository.getUserCompanies(user.id);

            res.json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailVerified: user.emailVerified,
                    avatar: user.avatar,
                    phoneNumber: user.phoneNumber,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                    companies: companies
                }
            });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    verifyEmail: async (req: Request, res: Response) => {
        try {
            const { token } = req.query;
            if (!token || typeof token !== 'string') {
                res.status(400).json({ success: false, error: 'Token required' });
                return;
            }

            const result = await authService.verifyEmail(token);

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({
                success: true,
                data: {
                    accessToken: result.accessToken,
                    user: result.user
                }
            });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    resendVerification: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ success: false, error: 'Email required' });
                return;
            }

            await authService.resendVerification(email);
            res.json({ success: true, message: 'Verification email sent' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};