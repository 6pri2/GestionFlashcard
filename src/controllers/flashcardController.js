import { request, response } from "express"
import { flashcards} from "../db/schema.js"
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
        res.status(200).json(flashcard)
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : "Failed tu query flashcard"
        })
    }
}