import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'
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
});

export const collections = sqliteTable('collections', {
	id: text('id', { length: 36 })
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	title: text('title', { length: 100 }).notNull(),
	description: text('description', { length: 512 }).notNull(),
    user_id : text("user_id").references(()=> users.id, { onDelete : 'cascade'}).notNull(),
	private: integer('private', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const flashcards = sqliteTable('flashcards', {
	id: text('id', { length: 36 })
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	front_text: text('front_text', { length: 512 }).notNull(),
	back_text: text('back_text', { length: 512 }).notNull(),
	url_front: text('url_front').default(null),
	url_back: text('url_back').default(null),
    collection_id : text("collection_id").references(()=> collections.id, { onDelete : 'cascade'}).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const progression = sqliteTable('progression', {
    flashcard_id: text('flashcard_id').notNull().references(() => flashcards.id, { onDelete: 'cascade' }),
    user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    progress_level: integer('progress_level').notNull(),
    last_review: integer('last_review', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    next_review_date: integer('next_review_date', { mode: 'timestamp' }).default(null),
  },
  (table) => ({
    pk: primaryKey(table.flashcard_id, table.user_id),
  })
);