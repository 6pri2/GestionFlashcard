import { request, response } from "express"
import {db} from '../db/db.js'
import { collections, flashcards, progression } from "../db/schema.js"
import jwt from "jsonwebtoken"
import { eq, and, like, lte } from "drizzle-orm"
import 'dotenv/config'

/**
 * @param {request} req 
 * @param {response} res 
 */

export const createCollection = async (req, res) => {

    const { title, description, is_private} = req.body;

    try{

        const [newCollection] = await db.insert(collections).values({
            title,
            description,
            user_id : req.user.userId,
            is_private, 
        }).returning();
        res.status(201).json({message : 'Question created',data: newCollection});

    }catch(error){

        console.error(error)
        res.status(500).json({
            error : 'Question Creation failed',
        })

    }
}

export const updateCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, is_private } = req.body;

        const [collection] = await db.select().from(collections).where(eq(collections.id, id));

        if (!collection) {
            return res.status(404).json({ message: 'Collection non trouvée !' });
        }

        if (collection.user_id !== req.user.userId && req.user.userAdmin === false) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cette collection !' });
        }

        const updateFields = {};
        if (title !== undefined) {
            updateFields.title = title;
        }
        if (description !== undefined) {
            updateFields.description = description;
        }
        if (is_private !== undefined) {
            updateFields.is_private = is_private;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'Aucun champ à mettre à jour fourni.' });
        }

        const [updatedCollection] = await db.update(collections)
            .set(updateFields)
            .where(eq(collections.id, id))
            .returning();

        res.status(200).json({ message: 'Collection mise à jour', data: updatedCollection });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Échec de la mise à jour de la collection',
        });
    }
}

export const collectionById = async (req, res) => {
    try{
        const {id} = req.params
        const [collection] = await db.select().from(collections).where(eq(collections.id,id))
        if(!collection){
            return res.status(404).json({message : 'Collection not found !'})
        }
        if(collection.is_private==true && collection.user_id!=req.user.userId && req.user.userAdmin==false){
            return res.status(403).json({message : 'It is not your collection and this collection is private !'})
        }
        res.status(200).json(collection)
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Failed to query collection by id',
        })
    }
}

export const collectionFlashcards = async (req, res) => {
    try{
        const {id} = req.params
        const [collection] = await db.select().from(collections).where(eq(collections.id,id))
        if(!collection){
            return res.status(404).json({message : 'Collection not found !'})
        }
        if(collection.is_private==true && collection.user_id!=req.user.userId && req.user.userAdmin==false){
            return res.status(403).json({message : 'It is not your collection and this collection is private !'})
        }
        const flashcardResult = await db.select().from(flashcards).where(eq(flashcards.collection_id,id))
        if(flashcardResult.length === 0){
            return res.status(404).json({message : 'There is not created flashcards for this collection !'})
        }
        res.status(200).json(flashcardResult)
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Failed to query collection by id',
        })
    }
}

export const collectionByTitle = async (req, res) => {
    try{
        try{
        const {title} = req.params
        const collection = await db
        .select()
        .from(collections)
        .where(
            and(
            eq(collections.is_private, false),
            like(collections.title, `%${title}%`) 
            )
        );
        if(!collection){
            return res.status(404).json({message : 'There is no collections with that expression in their title !'})
        }
        const filteredCollections = collection.filter(c => c.is_private === false || c.user_id === req.user.userId || req.user.userAdmin === true);

        if (filteredCollections.length === 0) {
            return res.status(404).json({ message: 'There are no collections with that expression in their title that you are authorized to see!' });
        }

        res.status(200).json(filteredCollections);
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Failed to query collection by id',
        })
    }
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Register failed',
        })
    }
}

export const myCollection = async (req, res) => {
    try{
        const collectionsData = await db.select().from(collections).where(eq(collections.user_id,req.user.userId))
        if(!collectionsData || collectionsData.length === 0){
            return res.status(404).json({message : 'Vous n\'avez pas de collections !'})
        }

        const collectionsWithFlashcards = await Promise.all(
            collectionsData.map(async (collection) => {
                const flashcardsData = await db.select().from(flashcards).where(eq(flashcards.collection_id, collection.id));
                return {
                    ...collection,
                    flashcards: flashcardsData
                };
            })
        );
        res.status(200).json(collectionsWithFlashcards)
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Échec de la requête de vos collections',
        })
    }
}

export const getFlashcardsToReviewByCollection = async (req, res) => {
    try {
        const { collection_id } = req.params;
        const userId = req.user.userId;
        const now = new Date();
        const [collection] = await db.select().from(collections).where(eq(collections.id, collection_id));
        if (!collection) {
            return res.status(404).json({ message: 'Collection non trouvée !' });
        }
        if (collection.is_private === true && collection.user_id !== userId && req.user.userAdmin === false) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à accéder à cette collection privée !' });
        }

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
            .leftJoin(progression, and(eq(flashcards.id, progression.flashcard_id), eq(progression.user_id, userId)))
            .where(
                and(
                    eq(collections.id, collection_id),
                    eq(collections.user_id, userId), 
                    progression.flashcard_id, 
                    lte(progression.next_review_date, now) 
                )
            );

        if (!flashcardsToReview || flashcardsToReview.length === 0) {
            return res.status(404).json({ message: "Aucune flashcard à réviser trouvée pour cette collection ou les conditions de révision ne sont pas remplies." });
        }

        res.status(200).json(flashcardsToReview);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Échec de la récupération des flashcards à réviser par collection.",
        });
    }
};

export const deleteCollection = async (req, res) => {
    try{
        const {id} = req.params
        const [collection] = await db.select().from(collections).where(eq(collections.id,id))
        if(!collection){
            return res.status(404).json({message : 'We don\'t find this collection'})
        }
        if(collection.is_private==true && collection.user_id!=req.user.userId && req.user.userAdmin==false){
            return res.status(403).json({message : 'It is not your collection and this collection is private !'})
        }
        const [deleteCollection] = await db.delete(collections).where(eq(collections.id,id)).returning();
        if(!deleteCollection) {
            return res.status(404).json({message : 'Collection not found'})
        }
        res.status(200).json({message : 'Collection deleted !'})
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Failed to delete question',
        })
    }
}