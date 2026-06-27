import { Router } from 'express';
import { getCompletedRevision, getDueRevision, getUpcomingRevision } from '../controllers/revision.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
const router = Router();

router.route('/due').get(authMiddleware ,getDueRevision)
router.route('/upcoming').get(authMiddleware ,getUpcomingRevision)
router.route('/completed').get(authMiddleware ,getCompletedRevision)

export default router