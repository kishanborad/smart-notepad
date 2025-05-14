import express from 'express';
import { auth } from '../middleware/auth';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} from '../controllers/noteController';

const router = express.Router();

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.get('/:id', auth, getNoteById);
router.patch('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);

export default router; 