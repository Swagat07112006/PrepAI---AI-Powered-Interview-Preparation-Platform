import { Router } from 'express';
import {
    getCompletedRevision,
    getDueRevision,
    getUpcomingRevision,
    getRevisionsByQuestion as getRevisionsByQuestionId,
    completeRevision,
    skipRevision,
    rescheduleRevision,
    markMissedRevision as markMissed
} from '../controllers/revision.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/due').get(authMiddleware, getDueRevision)
router.route('/upcoming').get(authMiddleware, getUpcomingRevision)
router.route('/completed').get(authMiddleware, getCompletedRevision)

router.route('/question/:questionId').get(authMiddleware, getRevisionsByQuestionId)
router.route('/:id/complete').put(authMiddleware, completeRevision)
router.route('/:id/skip').put(authMiddleware, skipRevision)
router.route('/:id/reschedule').put(authMiddleware, rescheduleRevision)
router.route('/:id/missed').put(authMiddleware, markMissed)

export default router;