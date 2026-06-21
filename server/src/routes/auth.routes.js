import { Router } from 'express'
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(authMiddleware, getCurrentUser)
router.route('/logout').post(authMiddleware, logoutUser)

export default router