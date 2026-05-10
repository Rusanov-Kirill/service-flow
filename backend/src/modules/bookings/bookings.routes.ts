import { Router } from 'express';
import { bookingsController } from './bookings.controller';

const router = Router();

router.get('/:companyId/booked-slots', bookingsController.getBookedSlots);

router.get('/:companyId', bookingsController.findAllCompanyBookings);
router.post('/', bookingsController.create);
router.patch('/:id', bookingsController.update);

export default router;