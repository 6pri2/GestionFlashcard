import { Router } from "express";
import {validateBody, validateParams} from '../middleware/validation.js'
import { authenticateToken } from "../middleware/authenticateToken.js";
import { createFlashcardSchema, flashcardIdSchema } from "../controllers/models/flashcard.js";
import { getFlashcardById, createFlashcard } from "../controllers/flashcardController.js";

const router = Router()

router.use(authenticateToken)

router.get('/:id',validateParams(flashcardIdSchema),getFlashcardById)

router.post('/',validateBody(createFlashcardSchema),createFlashcard)

export default router