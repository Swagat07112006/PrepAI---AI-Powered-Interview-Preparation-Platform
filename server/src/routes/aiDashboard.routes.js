import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getAIDashboard } from "../controllers/aiDashboard.controller.js";

const router = Router();

router.route('/').get(authMiddleware, getAIDashboard);

export default router;