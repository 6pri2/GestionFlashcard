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
            error : 'Register failed',
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
        
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Register failed',
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
        
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Register failed',
        })
    }
}

export const deleteCollection = async (req, res) => {
    try{
        
    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Register failed',
        })
    }
}