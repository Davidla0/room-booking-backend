
import { Router } from 'express';
import { getRoomsController } from '../controllers/rooms.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRoomSearchDates } from '../middleware/validateRoomSearch.middleware';

const router = Router();

router.get('/', validateRoomSearchDates, getRoomsController);

export default router;
