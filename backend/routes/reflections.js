import express from 'express';
import { protect } from '../middleware/auth.js';
import { saveReflection, getReflections } from '../controllers/reflectionController.js';

const router = express.Router();

router.post('/', protect, saveReflection);
router.get('/:userId', protect, getReflections);

export default router;
