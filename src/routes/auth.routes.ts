import { Router } from 'express';
import { registerController, loginController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { meController } from '../controllers/auth.controller';
const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', authMiddleware, meController);

export default router;
