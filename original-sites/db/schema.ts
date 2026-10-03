import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const rooms = sqliteTable('rooms', {
  code: text('code').primaryKey(),
  data: text('data').notNull(),
  revision: integer('revision').notNull().default(0),
  updated: integer('updated').notNull(),
});
export const heartbeats = sqliteTable('heartbeats', {
  room: text('room').notNull(),
  seat: integer('seat').notNull(),
  seen: integer('seen').notNull(),
}, table => [primaryKey({columns:[table.room,table.seat]})]);
