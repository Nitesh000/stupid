import type { FastifyPluginAsync } from "fastify";
import { createUserBody } from "@repo/validation/request/auth";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { AuthController } from "../controller/auth.controller";

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/signup",
    {
      schema: {
        body: createUserBody,
      },
    },
    AuthController.signupController,
  );
};
