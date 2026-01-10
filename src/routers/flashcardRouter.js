import { Router } from "express";
import {validateBody, validateParams} from '../middleware/validation.js'
import { authenticateToken } from "../middleware/authenticateToken.js";
import { createFlashcardSchema, flashcardIdSchema, progressSchema, updateFlashcardSchema } from "../controllers/models/flashcard.js";
import { getFlashcardById, createFlashcard, deleteFlashcard, updateFlashcard, reviseFlashcard, getAllFlashcardsToReview } from "../controllers/flashcardController.js"; // Ajout de getAllFlashcardsToReview

const router = Router()

router.use(authenticateToken)

router.get('/:id',validateParams(flashcardIdSchema),getFlashcardById)

router.post('/',validateBody(createFlashcardSchema),createFlashcard)

router.delete('/:id',validateParams(flashcardIdSchema),deleteFlashcard)

router.patch('/:id', validateParams(flashcardIdSchema), validateBody(updateFlashcardSchema),updateFlashcard)

router.patch('/revise/:id', validateParams(flashcardIdSchema),validateBody(progressSchema),reviseFlashcard)

router.get('/reviewAll', getAllFlashcardsToReview) 

export default router