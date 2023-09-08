import { pgTable, text, uuid, integer, date } from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";

// --- USER ---

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  name: text("name"),
  avatar_url: text("avatar_url"),
});

export type User = InferModel<typeof usersTable>;
export type NewUser = InferModel<typeof usersTable, "insert">;

// --- RESULT ---

export const resultsTable  = pgTable("results", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id).notNull(),
  word: text("word").notNull(),
  duration: integer("duration").notNull(),
  date: date("date").notNull(),
  errorDate: date("error_date"),
});

export type Result = InferModel<typeof resultsTable>;
export type NewResult = InferModel<typeof resultsTable, "insert">;

// --- ERROR ---

export const errorsTable = pgTable("errors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id).notNull(),
  word: text("word").notNull(),
  input: text("input").notNull(),
  date: date("date").notNull(),
});

export type Error = InferModel<typeof errorsTable>;
export type NewError = InferModel<typeof errorsTable, "insert">;

// --- PRESET 

export const presetsTable = pgTable("presets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id).notNull(),
  name: text("name").notNull(),
  text: text("text").notNull(),
  sessionLength: integer("session_length").notNull(),
  speed: integer("speed").notNull(),
  repetitions: integer("repetitions").notNull(),
});

export type Preset = InferModel<typeof presetsTable>;
export type NewPreset = InferModel<typeof presetsTable, "insert">;
