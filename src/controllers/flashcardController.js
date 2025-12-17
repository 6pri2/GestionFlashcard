import { request, response } from "express"
import { collections, flashcards} from "../db/schema.js"
import {db} from "../db/db.js"
import {eq} from "drizzle-orm"

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getFlashcardById = async (req, res) => {
    try{
        const {id} = req.params
        const [flashcard] = await db.select().from(flashcards).where(eq(flashcards.id,id))
        if(!flashcard){
            return res.status(404).json({message : 'Flashcard not found !'})
        }
        const [collection] = await db.select().from(collections).where(eq(collections.id,flashcard.collection_id))
        if(collection.private==true && collection.user_id!=req.user.userId && req.user.userAdmin==false){
            return res.status(403).json({message : 'It is not your flashcard and this collection is private !'})
        }
        res.status(200).json(flashcard)
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : "Failed to query flashcard"
        })
    }
}