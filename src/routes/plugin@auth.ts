import { serverAuth$ } from "@builder.io/qwik-auth";
import GitHub from "@auth/core/providers/github";
import type { Provider } from "@auth/core/providers";
import { createUser, getUserByEmail } from "~/data/user";
import { z } from "zod";

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(() => ({
    secret: z.string().parse(import.meta.env.VITE_NEXTAUTH_SECRET),
    trustHost: true,
    providers: [
      GitHub({
        clientId: z.string().parse(import.meta.env.VITE_GITHUB_ID),
        clientSecret: z.string().parse(import.meta.env.VITE_GITHUB_SECRET),
      }),
    ] as Provider[],
    callbacks: {
      session: async ({ session, token }: { session: any; token: any }) => {
        if (session?.user) {
          session.user.id = token.sub;
          const { email, name, image } = session.user;
          const user = await getUserByEmail(email);
          if (!user) {
            await createUser({
              email,
              name,
              avatar_url: image,
            });
          }
        }
        return session;
      },
      jwt: async ({ user, token }: { user?: any; token: any }) => {
        if (user) {
          token.sub = user.id;
        }
        return token;
      },
    },
    session: {
      strategy: "jwt",
    },
  }));
