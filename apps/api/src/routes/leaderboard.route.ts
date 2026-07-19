import type { FastifyInstance } from "fastify";
import { db } from "../lib/db";
import * as schema from "@repo/db/schema/index";
import { desc } from "drizzle-orm";

export const leaderboardRoutes = async (app: FastifyInstance) => {
  app.get("/leaderboard", async (_request, reply) => {
    const top100 = await db!
      .select({
        id: schema.user.id,
        name: schema.user.name,
        image: schema.user.image,
        loginCount: schema.user.loginCount,
        country: schema.user.country,
      })
      .from(schema.user)
      .orderBy(desc(schema.user.loginCount))
      .limit(100);

    return reply.send({ leaderboard: top100 });
  });
};
