
import { Router } from 'express';
import { createBookingController, getMyBookingsController } from '../controllers/bookings.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createBookingController);
router.get('/my', authMiddleware, getMyBookingsController);

export default router;
