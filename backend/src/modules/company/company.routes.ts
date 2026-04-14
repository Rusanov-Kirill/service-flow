import { Router } from 'express';
import { companyController } from './company.controller';

const router = Router();

router.post('/', companyController.createWithServices);

export default router;