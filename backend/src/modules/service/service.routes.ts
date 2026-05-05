import { Router } from 'express';
import { serviceController } from './service.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

router.post('/companies/:companyId/services', authMiddleware, serviceController.create);
router.get('/companies/:companyId/services', authMiddleware, serviceController.getByCompany);

router.get('/:serviceId', authMiddleware, serviceController.getById);
router.patch('/:serviceId', authMiddleware, serviceController.update);
router.delete('/:serviceId', authMiddleware, serviceController.delete);

export default router;