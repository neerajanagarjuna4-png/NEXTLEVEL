import express from 'express';
import { protect } from '../middleware/auth.js';
import { requestPartnership, respondPartnership, sendCheckIn } from '../controllers/partnershipController.js';

const router = express.Router();

router.post('/request', protect, requestPartnership);
router.post('/respond', protect, respondPartnership);
router.post('/checkin', protect, sendCheckIn);

export default router;
