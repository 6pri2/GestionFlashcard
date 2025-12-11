import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { randomUUID } from 'crypto'

export const users = sqliteTable('users', {
	id: text('id', { length: 36 })
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	email: text('email').notNull().unique(),
	firstname: text('firstname', { length: 30 }).notNull(),
	lastname: text('lastname', { length: 30 }).notNull(),
	password: text('password', { length: 255 }).notNull(),
	admin: integer('admin', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
})
