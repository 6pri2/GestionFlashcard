import { Router } from "express";
import {createCollection, updateCollection, collectionById, collectionByTitle, myCollection, deleteCollection} from '../controllers/collectionController.js'
import {validateBody} from '../middleware/validation.js'
import { collectionSchema } from "../controllers/models/collection.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router()

router.use(authenticateToken)

router.post('/createCollection',validateBody(collectionSchema) ,createCollection)

router.post('/updateCollection',validateBody(collectionSchema) ,updateCollection)

router.get("/collectionById", collectionById)

router.get("/collectionByTitle", collectionByTitle)

router.get("/myCollection", myCollection)

router.delete("/deleteCollection", deleteCollection)

export default router

