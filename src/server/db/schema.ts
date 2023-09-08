import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  name: text("name"),
  avatar_url: text("avatar_url"),
});

export type User = InferModel<typeof usersTable>;
export type NewUser = InferModel<typeof usersTable, "insert">;
