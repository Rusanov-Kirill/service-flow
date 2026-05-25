import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/finance', analyticsController.getFinanceAnalytics);
router.get('/revenue', analyticsController.getRevenueAnalytics);
router.get('/top-services', analyticsController.getTopServices);
router.get('/status-distribution', analyticsController.getStatusDistribution);
router.get('/popular-days', analyticsController.getPopularDays);
router.get('/dashboard', analyticsController.getDashboardStats);

export default router;