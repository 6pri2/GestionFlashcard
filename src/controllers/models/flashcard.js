import { z } from "zod"

export const flashcardIdSchema = z.object({
    id : z.uuid()
})