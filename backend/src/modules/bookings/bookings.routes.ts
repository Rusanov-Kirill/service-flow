import { Router } from 'express';
import { bookingsController } from './bookings.controller';

const router = Router();

router.post('/', bookingsController.create);
router.patch('/:id', bookingsController.update);

export default router;