import { Request, Response } from 'express';
import { favoritesService } from './favorites.service';
import { addFavoriteSchema, checkFavoriteSchema } from './favorites.validation';

export const favoritesController = {
    getUserFavorites: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Пользователь не авторизован',
                });
            }

            const favorites = await favoritesService.getUserFavorites(userId);
            return res.status(200).json({
                success: true,
                data: favorites,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    addFavorite: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Пользователь не авторизован',
                });
            }

            const result = addFavoriteSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: result.error.issues[0]?.message || 'Ошибка валидации',
                });
            }

            const favorite = await favoritesService.addFavorite(userId, result.data);
            return res.status(201).json({
                success: true,
                data: favorite,
            });
        } catch (error: any) {
            if (error.message === 'Компания уже в избранном') {
                return res.status(409).json({
                    success: false,
                    error: error.message,
                });
            }
            if (error.message === 'Компания не найдена') {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    removeFavorite: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Пользователь не авторизован',
                });
            }

            const companyId = Array.isArray(req.params['companyId'])
                ? req.params['companyId'][0]
                : req.params['companyId'];

            if (!companyId) {
                return res.status(400).json({
                    success: false,
                    error: 'companyId обязателен',
                });
            }

            await favoritesService.removeFavorite(userId, companyId);
            return res.status(200).json({
                success: true,
                message: 'Компания удалена из избранного',
            });
        } catch (error: any) {
            if (error.message === 'Компания не найдена в избранном') {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    checkFavorite: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Пользователь не авторизован',
                });
            }

            const result = checkFavoriteSchema.safeParse({
                companyId: req.params['companyId'],
            });
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: result.error.issues[0]?.message || 'Ошибка валидации',
                });
            }

            const isFavorite = await favoritesService.checkFavorite(userId, result.data.companyId);
            return res.status(200).json({
                success: true,
                data: { isFavorite },
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },
};