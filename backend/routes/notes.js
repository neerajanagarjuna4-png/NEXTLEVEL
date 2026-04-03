import express from 'express';
import { protect } from '../middleware/auth.js';
import { listNotes, saveNote } from '../controllers/noteController.js';

const router = express.Router();

router.get('/', protect, listNotes);
router.post('/', protect, saveNote);

export default router;
