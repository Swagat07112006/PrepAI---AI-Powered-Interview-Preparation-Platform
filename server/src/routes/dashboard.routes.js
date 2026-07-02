import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getDashBoardData } from "../controllers/dashboard.controller.js";

const router = Router();

router.route('/').get(authMiddleware, getDashBoardData)

export default router;