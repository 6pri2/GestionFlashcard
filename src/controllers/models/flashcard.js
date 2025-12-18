import { z } from "zod"

export const flashcardIdSchema = z.object({
    id : z.uuid()
})

export const createFlashcardSchema = z.object({
    front_text : z.string().min(1).max(512,"Front_text must be at most 512 characters"),
    back_text : z.string().min(1).max(512,"Back_text must be at most 512 characters"),
    url_front : z.url().optional(),
    url_back : z.url().optional(),
    collection_id : z.uuid()
})

export const updateFlashcardSchema = z.object({
    front_text : z.string().min(1).max(512,"Front_text must be at most 512 characters").optional(),
    back_text : z.string().min(1).max(512,"Back_text must be at most 512 characters").optional(),
    url_front : z.url().optional(),
    url_back : z.url().optional()
})