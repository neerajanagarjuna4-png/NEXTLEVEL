import express from 'express';
import { protect } from '../middleware/auth.js';
import { generatePlan, getPlan, markDayComplete } from '../controllers/plannerController.js';

const router = express.Router();

router.post('/generate', protect, generatePlan);
router.get('/', protect, getPlan);
router.patch('/mark-day', protect, markDayComplete);

export default router;
