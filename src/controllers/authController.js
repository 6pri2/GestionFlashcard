import { request, response } from "express"
import bcrypt from 'bcrypt'
import {db} from '../db/db.js'
import { users } from "../db/schema.js"
import jwt from "jsonwebtoken"
import { eq } from "drizzle-orm"
import 'dotenv/config'

/**
 * @param {request} req 
 * @param {response} res 
 */

export const register = async (req, res) => {
    try{
        const {email, firstname, lastname, password} = req.body

        const hashedPassword = await bcrypt.hash(password,12)

        const [newUser] = await db.insert(users).values({
            email,
            firstname,
            lastname,
            password : hashedPassword
        }).returning({
            email: users.email,
            firstname : users.firstname,
            lastname : users.lastname,
            id : users.id
        })

        const token = jwt.sign({ userId : newUser.id, email : newUser.email, firstname : newUser.firstname, lastname : newUser.lastname , admin : newUser.admin}, process.env.JWT_SECRET, {expiresIn : '24h'} )

        res.status(201).json({
            message : "User created",
            userDate : newUser,
            token,
        })

    }catch(error){
        console.error(error)
        res.status(500).json({
            error : 'Register failed',
        })
    }
}

export const login = async (req, res) => {
    try{
        const {email, password} = req.body
        const [user] = await db.select().from(users).where(eq(users.email,email))

        if(!user){
            return res.status(401).json({error : "Invalid email or password !"})
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)

        if (!isPasswordValid){
            return res.status(401).json({error : "Invalid email or password !"})
        }

        const token = jwt.sign({ userId : user.id, email : user.email, firstname : user.firstname, lastname : user.lastname , admin : user.admin}, process.env.JWT_SECRET, {expiresIn : '24h'} )

        res.status(200).json({
            message: "User logged in",
            userData: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        })

    }catch (error){
        console.error(error)
        res.status(500).json({
            error: "Login failed",
        })
    }
}

export const information = async (req, res) => {
    try {
        const userId = req.user.userId; 

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId));

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "User information :",
            userData: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            },
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};
