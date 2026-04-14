import { Router } from 'express';
import { serviceController } from './service.controller';

const router = Router();

router.post('/bulk', serviceController.createMany);

export default router;