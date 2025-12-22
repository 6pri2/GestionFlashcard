import { request, response } from "express"
import { collections, flashcards, progression} from "../db/schema.js"
import {db} from "../db/db.js"
import {eq, and} from "drizzle-orm"

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

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const createFlashcard = async (req, res) => {
    const { front_text, back_text, url_front, url_back, collection_id } = req.body;

    const [collection] = await db.select().from(collections).where(eq(collections.id,collection_id))
        if(collection.user_id!=req.user.userId){
            return res.status(403).json({message : 'It is not your flashcard and this collection is private !'})
        }

    try{
        const [newFlashcard] = await db.insert(flashcards).values({
            front_text,
            back_text,
            url_front,
            url_back,
            collection_id,
        }).returning();
        res.status(201).json({message : 'Flashcard created', data : newFlashcard});
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Failed to create flashcard"});
    }
};

export const deleteFlashcard = async (req, res)=>{
    try{
        const {id} = req.params
        const [flashcard] = await db.select().from(flashcards).where(eq(flashcards.id,id))
        if(!flashcard){
            return res.status(404).json({message : 'Flashcard not found !'})
        }
        const [collection] = await db.select().from(collections).where(eq(collections.id,flashcard.collection_id))
        if(collection.user_id!=req.user.userId && req.user.userAdmin==false){
            return res.status(403).json({message : 'It is not your flashcard !'})
        }
       
        await db.delete(flashcards).where(eq(flashcards.id,id));
        res.status(200).json({message : 'Flashcard deleted !'})
    }catch(error){
        console.error(error);
        res.status(500).json({error : 'Failed to delete flashcard'});
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const updateFlashcard = async (req, res)=>{
    try{
        const {id} = req.params
        const { front_text, back_text, url_front, url_back } = req.body;

        const [flashcard] = await db.select().from(flashcards).where(eq(flashcards.id,id))
        if(!flashcard){
            return res.status(404).json({message : 'Flashcard not found !'})
        }
        const [collection] = await db.select().from(collections).where(eq(collections.id,flashcard.collection_id))
        if(collection.user_id!=req.user.userId){
            return res.status(403).json({message : 'It is not your flashcard !'})
        }

        await db.update(flashcards).set({
            front_text,
            back_text,
            url_front,
            url_back
        }).where(eq(flashcards.id,id))

        res.status(200).json({message : 'Flashcard updated !'})
    }catch(error){
        console.error(error);
        res.status(500).json({error : 'Failed to update flashcard'});
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const reviseFlashcard = async (req, res)=>{
    try{
        const {id} = req.params
        const { progress_level } = req.body;

        const [flashcard] = await db.select().from(flashcards).where(eq(flashcards.id,id))
        if(!flashcard){
            return res.status(404).json({message : 'Flashcard not found !'})
        }

        const last_review = new Date();
        let next_review_date = new Date(last_review);

        switch(progress_level){
            case 1 : 
                next_review_date.setDate(next_review_date.getDate() + 1);
                break;
            case 2 : 
                next_review_date.setDate(next_review_date.getDate() + 2);
                break;
            case 3 : 
                next_review_date.setDate(next_review_date.getDate() + 4);
                break;
            case 4 : 
                next_review_date.setDate(next_review_date.getDate() + 8);
                break;
            case 5 : 
                next_review_date.setDate(next_review_date.getDate() + 16);
                break;
            default : 
                return res.status(400).json({message : 'Invalid progress level'})
        }

        const [updateProgression] = await db.update(progression).set({
            progress_level,
            last_review,
            next_review_date,

        }).where(
            and(
                eq(progression.flashcard_id,id),
                eq(progression.user_id, req.user.UserId)
            )
        ).returning();

        if (updateProgression){
            return res.status(200).json({message : 'Progression updated', data : updateProgression})
        }

        const [newProgression] = await db.insert(progression).values({
            flashcard_id : id, 
            progress_level,
            last_review,
            next_review_date,
            user_id : req.user.UserId,
        }).returning();
        res.status(201).json({message : 'Progression created',data : newProgression})
        

    }catch(error){
        console.error(error);
        res.status(500).json({error : 'Failed to update revise flashcard'});
    }
}