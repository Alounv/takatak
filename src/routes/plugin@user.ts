import type { Cookie } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { getUserFromCookie } from "~/data/user";
import { dbConfig } from "~/server/db/client";

export const useGetCurrentUser = routeLoader$(async ({ cookie }) => {
  const { user, pool } = await getUserAndDb(cookie);
  await pool.end();
  return user;
});

export const getUserAndDb = async (cookie: Cookie) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);
  const user = await getUserFromCookie(db, cookie);
  return { db, user, pool };
};
