import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';

export const analyticsController = {
    getFinanceAnalytics: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId, startDate, endDate } = req.query;
            
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'companyId обязателен' 
                });
            }

            if (!startDate || typeof startDate !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'startDate обязателен' 
                });
            }

            if (!endDate || typeof endDate !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'endDate обязателен' 
                });
            }

            const startDateTime = new Date(startDate);
            startDateTime.setHours(0, 0, 0, 0);
            
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);

            const analytics = await analyticsService.getFinanceAnalytics(
                companyId,
                startDateTime,
                endDateTime
            );

            return res.json({ success: true, data: analytics });
        } catch (error: any) {
            console.error('Ошибка в getFinanceAnalytics:', error);
            return res.status(400).json({ success: false, error: error.message });
        }
    },

    getRevenueAnalytics: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId, startDate, endDate, period } = req.query;
            
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'companyId обязателен' 
                });
            }

            if (!startDate || typeof startDate !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'startDate обязателен' 
                });
            }

            if (!endDate || typeof endDate !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'endDate обязателен' 
                });
            }

            const startDateTime = new Date(startDate);
            startDateTime.setHours(0, 0, 0, 0);
            
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);

            const analytics = await analyticsService.getRevenueAnalytics(
                companyId,
                startDateTime,
                endDateTime,
                (period as 'day' | 'week' | 'month') || 'day'
            );

            return res.json({ success: true, data: analytics });
        } catch (error: any) {
            console.error('Ошибка в getRevenueAnalytics:', error);
            return res.status(400).json({ success: false, error: error.message });
        }
    },

    getTopServices: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId, startDate, endDate, limit } = req.query;
            
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'companyId обязателен' 
                });
            }

            if (!startDate || typeof startDate !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'startDate обязателен' 
                });
            }

            if (!endDate || typeof endDate !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'endDate обязателен' 
                });
            }

            const startDateTime = new Date(startDate);
            startDateTime.setHours(0, 0, 0, 0);
            
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);

            const topServices = await analyticsService.getTopServices(
                companyId,
                startDateTime,
                endDateTime,
                limit ? Number(limit) : 10
            );

            return res.json({ success: true, data: topServices });
        } catch (error: any) {
            console.error('Ошибка в getTopServices:', error);
            return res.status(400).json({ success: false, error: error.message });
        }
    },

    getStatusDistribution: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId, startDate, endDate } = req.query;
            
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'companyId обязателен' 
                });
            }

            if (!startDate || typeof startDate !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'startDate обязателен' 
                });
            }

            if (!endDate || typeof endDate !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'endDate обязателен' 
                });
            }

            const startDateTime = new Date(startDate);
            startDateTime.setHours(0, 0, 0, 0);
            
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);

            const distribution = await analyticsService.getStatusDistribution(
                companyId,
                startDateTime,
                endDateTime
            );

            return res.json({ success: true, data: distribution });
        } catch (error: any) {
            console.error('Ошибка в getStatusDistribution:', error);
            return res.status(400).json({ success: false, error: error.message });
        }
    },

    getPopularDays: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId, startDate, endDate } = req.query;
            
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'companyId обязателен' 
                });
            }

            if (!startDate || typeof startDate !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'startDate обязателен' 
                });
            }

            if (!endDate || typeof endDate !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'endDate обязателен' 
                });
            }

            const startDateTime = new Date(startDate);
            startDateTime.setHours(0, 0, 0, 0);
            
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);

            const popularDays = await analyticsService.getPopularDays(
                companyId,
                startDateTime,
                endDateTime
            );

            return res.json({ success: true, data: popularDays });
        } catch (error: any) {
            console.error('Ошибка в getPopularDays:', error);
            return res.status(400).json({ success: false, error: error.message });
        }
    },

    getDashboardStats: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId } = req.query;
            
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'companyId обязателен' 
                });
            }

            const stats = await analyticsService.getDashboardStats(companyId);
            return res.json({ success: true, data: stats });
        } catch (error: any) {
            console.error('Ошибка в getDashboardStats:', error);
            return res.status(400).json({ success: false, error: error.message });
        }
    },
};