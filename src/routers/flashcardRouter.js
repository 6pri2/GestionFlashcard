import { Router } from "express";
import {validateBody, validateParams} from '../middleware/validation.js'
import { authenticateToken } from "../middleware/authenticateToken.js";
import { createFlashcardSchema, flashcardIdSchema, updateFlashcardSchema } from "../controllers/models/flashcard.js";
import { getFlashcardById, createFlashcard, deleteFlashcard, updateFlashcard } from "../controllers/flashcardController.js";

const router = Router()

router.use(authenticateToken)

router.get('/:id',validateParams(flashcardIdSchema),getFlashcardById)

router.post('/',validateBody(createFlashcardSchema),createFlashcard)

router.delete('/:id',validateParams(flashcardIdSchema),deleteFlashcard)

router.patch('/:id', validateParams(flashcardIdSchema), validateBody(updateFlashcardSchema),updateFlashcard)

export default router