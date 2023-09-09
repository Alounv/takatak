import { decode } from "@auth/core/jwt";
import type { Cookie } from "@builder.io/qwik-city";
import { z } from "zod";
import type { NewUser, User } from "~/server/db/schema";
import { selectedPresetsTable } from "~/server/db/schema";
import { usersTable } from "~/server/db/schema";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

export async function getUserByEmail(
  db: NeonHttpDatabase,
  email: User["email"],
) {
  const found = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .leftJoin(
      selectedPresetsTable,
      eq(selectedPresetsTable.userId, usersTable.id),
    );

  return {
    ...found[0].users,
    selectedPresetId: found[0].selected_presets?.presetId,
  };
}

export async function createUser(
  db: NeonHttpDatabase,
  { email, name, avatar_url }: NewUser,
) {
  const inserted = await db
    .insert(usersTable)
    .values({ email, name, avatar_url })
    .returning();

  return inserted[0];
}

const secret = z.string().parse(import.meta.env.VITE_NEXTAUTH_SECRET);

export const getUserFromCookie = async (
  db: NeonHttpDatabase,
  cookie: Cookie,
) => {
  const sessionToken =
    cookie.get("next-auth.session-token") ||
    cookie.get("__Secure-next-auth.session-token");

  if (!sessionToken) return null;

  const token = z.string().parse(sessionToken?.value);
  const decoded = await decode({ token, secret });
  const email = decoded?.email;
  const result = email ? await getUserByEmail(db, email) : null;

  return result;
};
