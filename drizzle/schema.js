import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const prompts = pgTable('prompts', {
  id: serial('id').primaryKey(),
  prompt: text('prompt').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: uuid('user_id').notNull(),
});