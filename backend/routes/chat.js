import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getRoomMessages } from '../controllers/chatController.js';

const router = Router();

// Protected chat history endpoint
router.use(requireAuth);
router.get('/room/:roomId', getRoomMessages);

export default router;
