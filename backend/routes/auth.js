import { Router } from 'express';
import { signup, login, getMe, mentorLogin } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/mentor-login', mentorLogin);
router.get('/me', requireAuth, getMe);

export default router;
