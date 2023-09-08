import { decode } from "@auth/core/jwt";
import type { Cookie } from "@builder.io/qwik-city";
import { z } from "zod";
import { eq } from "drizzle-orm/expressions";
import { dbConfig } from "~/server/db/client";
import type { NewUser, User } from "~/server/db/schema";
import { usersTable } from "~/server/db/schema";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

export async function getUserByEmail(email: User["email"]) {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const found = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  await pool.end();
  return found[0];
}

export async function createUser({ email, name, avatar_url }: NewUser) {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const inserted = await db
    .insert(usersTable)
    .values({ email, name, avatar_url })
    .returning();

  await pool.end();
  return inserted[0];
}

const secret = z.string().parse(import.meta.env.VITE_NEXTAUTH_SECRET);

export const getUserFromCookie = async (cookie: Cookie) => {
  const sessionToken =
    cookie.get("next-auth.session-token") ||
    cookie.get("__Secure-next-auth.session-token");

  if (!sessionToken) return null;

  const token = z.string().parse(sessionToken?.value);
  const decoded = await decode({ token, secret });
  const email = decoded?.email;
  const result = email ? await getUserByEmail(email) : null;

  return result;
};
