import { request, response } from "express"
import { collections, flashcards, progression } from "../db/schema.js"
import { db } from "../db/db.js"
import { eq, and, isNotNull, sql, lte, or } from "drizzle-orm" 


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
        if(collection.is_private==true && collection.user_id!=req.user.userId && req.user.userAdmin==false){
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

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if(collection.user_id!=req.user.userId){
            return res.status(403).json({message : 'It is not your collection !'})
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

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */

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

        const [collection] = await db.select().from(collections).where(eq(collections.id,flashcard.collection_id))
        if(collection.user_id!=req.user.userId && collection.is_private==true){
            return res.status(403).json({message : 'This collection is private and it is not your flashcard !'})
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
                eq(progression.user_id, req.user.userId)
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
            user_id : req.user.userId,
        }).returning();
        res.status(201).json({message : 'Progression created',data : newProgression})
        

    }catch(error){
        console.error(error);
        res.status(500).json({error : 'Failed to update revise flashcard'});
    }
}


export const getAllFlashcardsToReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const now = new Date(); 
        const flashcardsToReview = await db
            .select({
                id: flashcards.id,
                front_text: flashcards.front_text,
                back_text: flashcards.back_text,
                url_front: flashcards.url_front,
                url_back: flashcards.url_back,
                collection_id: flashcards.collection_id,
                progress_level: progression.progress_level,
                last_review: progression.last_review,
                next_review_date: progression.next_review_date,
            })
            .from(flashcards)
            .innerJoin(collections, eq(flashcards.collection_id, collections.id))
            .leftJoin(progression, and(
                eq(flashcards.id, progression.flashcard_id), 
                eq(progression.user_id, userId)
            ))
            .where(
                and(
                    or(
                        eq(collections.user_id, userId),
                        eq(collections.is_private, false)
                    ),
                    isNotNull(progression.flashcard_id),
                    lte(progression.next_review_date, now)
                )
            );
        
        if (!flashcardsToReview || flashcardsToReview.length === 0) {
            return res.status(404).json({ message: "Aucune flashcard à réviser trouvée pour vous." });
        }
        res.status(200).json(flashcardsToReview);

    } catch (error) {
        console.error("Erreur CRITIQUE getAllFlashcardsToReview :", error);
        res.status(500).json({
            error: "Échec de la récupération des flashcards à réviser.",
            details: error.message
        });
    }
};