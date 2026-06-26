import {Router} from 'express'
import { createNote, deleteNote, getNote, listNotes, updateNote } from '../controllers/note.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js'
const router = Router();

router.route('/').post(authMiddleware, createNote)
router.route('/').get(authMiddleware, listNotes)
router.route('/:id').get(authMiddleware, getNote)
router.route('/:id').put(authMiddleware, updateNote)
router.route('/:id').delete(authMiddleware, deleteNote)

export default router