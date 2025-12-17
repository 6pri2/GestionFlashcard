import {z} from "zod";

export const collectionSchema = z.object({
    title : z.string().min(1).max(100, "Collection title must be at most 100 characters"),
    description : z.string().min(1).max(512, "Collection description text must be at most 512 characters"),
    is_private : z.boolean().optional() ,
})

export const getByIdSchema = z.object({
    id : z.uuid()
})