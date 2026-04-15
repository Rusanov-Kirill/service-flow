import { Router } from 'express';
import { companyController } from './company.controller';

const router = Router();

router.get('/slug/:slug', companyController.getBySlug);
router.get('/owner/:ownerId', companyController.getByOwnerId);
router.get('/:id', companyController.getById);
router.get('/', companyController.getAll);
router.post('/', companyController.createWithServices);

export default router;