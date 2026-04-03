import express from 'express';
import { protect, mentorOnly } from '../middleware/auth.js';
import { createNotification, getNotifications, markRead } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/create', protect, mentorOnly, createNotification);
router.get('/', protect, getNotifications);
router.put('/read/:id', protect, markRead);

export default router;
