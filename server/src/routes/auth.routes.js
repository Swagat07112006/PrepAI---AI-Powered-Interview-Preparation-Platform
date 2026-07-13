import { Router } from 'express'
import { getCurrentUser, loginUser, logoutUser, registerUser, updateUserProfile } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(authMiddleware, getCurrentUser)
router.route('/logout').post(authMiddleware, logoutUser)
router.route('/profile').put(authMiddleware, updateUserProfile)

export default router