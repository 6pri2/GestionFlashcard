import { Router } from "express";
import {validateBody, validateParams} from '../middleware/validation.js'
import { authenticateToken } from "../middleware/authenticateToken.js";
import { flashcardIdSchema } from "../controllers/models/flashcard.js";
import { getFlashcardById } from "../controllers/flashcardController.js";


const router = Router()

router.use(authenticateToken)

router.get('/:id',validateParams(flashcardIdSchema),getFlashcardById)

export default router