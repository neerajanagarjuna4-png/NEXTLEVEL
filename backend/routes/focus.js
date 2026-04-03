import express from 'express';
import { protect } from '../middleware/auth.js';
import { logSession, getTodaySessions } from '../controllers/focusController.js';

const router = express.Router();

router.post('/log', protect, logSession);
router.get('/today', protect, getTodaySessions);

export default router;
