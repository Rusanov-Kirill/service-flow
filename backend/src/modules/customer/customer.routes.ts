import { Router } from 'express';
import { customerController } from './customer.controller';

const router = Router();

router.post('/find-or-create', customerController.findOrCreate);

export default router;