import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@repo/db/schema/index";
import { db } from "./db";
import { sql } from "drizzle-orm";

if (!db) {
  throw new Error("[BA] DB failed to start.");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      loginCount: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
      country: {
        type: "string",
        required: false,
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          // Increment the user's login count on every new session
          await db!
            .update(schema.user)
            .set({ loginCount: sql`${schema.user.loginCount} + 1` })
            .where(sql`${schema.user.id} = ${session.userId}`);
        },
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    atlassian: {
      clientId: process.env.ATLASSIAN_CLIENT_ID as string,
      clientSecret: process.env.ATLASSIAN_CLIENT_SECRET as string,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    },
  },
});

