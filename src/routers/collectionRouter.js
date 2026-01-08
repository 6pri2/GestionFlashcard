import { Router } from "express";
import {createCollection, updateCollection, collectionById, collectionByTitle, myCollection, deleteCollection, collectionFlashcards, getFlashcardsToReviewByCollection} from '../controllers/collectionController.js'
import {validateBody, validateParams} from '../middleware/validation.js'
import { collectionSchema, getByIdSchema, getByTitle, updateCollectionSchema } from "../controllers/models/collection.js";
import { getFlashcardsToReviewByCollectionSchema } from "../controllers/models/flashcard.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router()

router.use(authenticateToken)

router.post('/createCollection', validateBody(collectionSchema), createCollection)

router.put('/updateCollection/:id', validateParams(getByIdSchema), validateBody(updateCollectionSchema), updateCollection)

router.get("/collectionById/:id", validateParams(getByIdSchema), collectionById)

router.get("/collectionFlashcrads/:id", validateParams(getByIdSchema), collectionFlashcards)

router.get("/collectionFlashcardsToReview/:collection_id", validateParams(getFlashcardsToReviewByCollectionSchema), getFlashcardsToReviewByCollection)

router.get("/collectionByTitle/:title",validateParams(getByTitle), collectionByTitle)

router.get("/myCollection", myCollection)

router.delete("/deleteCollection/:id", validateParams(getByIdSchema), deleteCollection)

export default router

