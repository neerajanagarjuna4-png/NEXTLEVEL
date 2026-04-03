import express from 'express';
import { protect } from '../middleware/auth.js';
import { getMonthlyReport } from '../controllers/reportCardController.js';

const router = express.Router();

router.get('/:userId', protect, getMonthlyReport);

export default router;
