import {z} from "zod";

export const collectionSchema = z.object({
    title : z.string().min(1).max(100, "Collection title must be at most 100 characters"),
    description : z.string().min(1).max(512, "Collection description text must be at most 512 characters"),
    is_private : z.boolean().optional() ,
})

export const loginSchema = z.object({
    email : z.email(),  
    password : z.string().min(6).max(255)
})