import { Request, Response } from 'express';
import { userService } from './user.service';
import { updateProfileSchema } from './user.validation';
import { generateAccessToken } from '../../shared/utils/jwt';

export const userController = {
    getProfile: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                res.status(401).json({ success: false, error: 'User not authenticated' });
                return;
            }

            const user = await userService.getProfile(userId);

            res.json({
                success: true,
                data: user
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    },

    updateProfile: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                res.status(401).json({ success: false, error: 'User not authenticated' });
                return;
            }

            const validatedData = updateProfileSchema.parse(req.body);

            const updatedUser = await userService.updateProfile(userId, validatedData);

            const newAccessToken = generateAccessToken({
                userId: updatedUser.id,
                email: updatedUser.email
            });

            res.json({
                success: true,
                data: {
                    accessToken: newAccessToken,
                    user: updatedUser
                }
            });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({
                    success: false,
                    error: error.errors[0]?.message || 'Validation error'
                });
                return;
            }
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },
};