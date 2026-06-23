import { Router } from "express";
import { createQuestion, deleteQuestion, getQuestion, listQuestions, updateQuestion } from "../controllers/question.controller.js";
import authMiddleware from '../middlewares/auth.middleware.js'


const router = Router()

// Create Questions
router.route('/').post(authMiddleware, createQuestion)

// Get All questions of user
router.route('/').get(authMiddleware, listQuestions)

// Get a particular question of user
router.route('/:id').get(authMiddleware, getQuestion)

// Update a question of a user
router.route('/:id').put(authMiddleware, updateQuestion)

// Delete a question of a user
router.route('/:id').delete(authMiddleware, deleteQuestion)

export default router