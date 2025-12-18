import { request, response } from "express"
import {db} from '../db/db.js'
import { collections } from "../db/schema.js"
import jwt from "jsonwebtoken"
import { eq } from "drizzle-orm"
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
    try{
        
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Register failed',
        })
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

export const collectionByTitle = async (req, res) => {
    try{
        
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Register failed',
        })
    }
}

export const myCollection = async (req, res) => {
    try{
        const collection = await db.select().from(collections).where(eq(collections.user_id,req.user.userId))
        if(!collection){
            return res.status(404).json({message : 'You don\'t have collections !'})
        }
        res.status(200).json(collection)
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Failed to query your collection',
        })
    }
}

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