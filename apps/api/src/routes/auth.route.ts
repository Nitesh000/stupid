import type { FastifyPluginAsync } from "fastify";
import { createUserBody } from "@repo/validation/request/auth";

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/signup",
    {
      schema: {
        body: createUserBody,
      },
    },
    () => {
      return { page: "signup" };
    },
  );
};
