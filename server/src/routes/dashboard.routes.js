import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { getDashBoardData } from "../controllers/dashboard.controller";

const router = Router();

router.route('/', authMiddleware, getDashBoardData)

export default router;