import type { FastifyPluginAsync } from "fastify";
import { createUserBody } from "@repo/validation/request/auth";
import { db } from "..";
import { usersTable } from "@repo/db/schema/index";
import { eq } from "drizzle-orm";
import { AppError } from "../config/err";
import argon2 from "argon2";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/signup",
    {
      schema: {
        body: createUserBody,
      },
    },
    async (req, reply) => {
      // check if the user already exist
      const existingUser = await db
        ?.select({
          id: usersTable.id,
        })
        .from(usersTable)
        .where(eq(usersTable.email, req.body.email))
        .limit(1);

      if (existingUser && existingUser.length > 0) {
        throw new AppError("User Already Exist", 409);
      }

      const hashedPassword = await argon2.hash(req.body.password);

      const data = await db
        ?.insert(usersTable)
        .values({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        })
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        });

      return reply.status(200).send({
        success: true,
        message: "User added successfully",
        data,
      });
    },
  );
};
