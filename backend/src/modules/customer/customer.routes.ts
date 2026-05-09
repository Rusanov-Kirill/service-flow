import { Router } from 'express';
import { customerController } from './customer.controller';

const router = Router();

router.post('/find-or-create', customerController.findOrCreate);
router.get('/by-user-company', customerController.findByUserAndCompany);
router.get('/all-by-company', customerController.getAllCustomersByCompanyId);
router.get('/by-email', customerController.getCustomerByEmail);

export default router;