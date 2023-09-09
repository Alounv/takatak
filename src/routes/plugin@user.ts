import type { Cookie } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getUserFromCookie } from "~/data/user";
import { dbConfig } from "~/server/db/client";

export const useGetCurrentUser = routeLoader$(async ({ cookie }) => {
  const { user } = await getUserAndDb(cookie);
  return user;
});

export const getUserAndDb = async (cookie: Cookie) => {
  const sql = neon(dbConfig.url);
  const db = drizzle(sql);
  const user = await getUserFromCookie(db, cookie);
  return { db, user };
};
