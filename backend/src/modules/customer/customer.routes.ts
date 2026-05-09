import { Router } from 'express';
import { customerController } from './customer.controller';

const router = Router();

router.post('/find-or-create', customerController.findOrCreate);
router.get('/by-user-company', customerController.findByUserAndCompany);

export default router;