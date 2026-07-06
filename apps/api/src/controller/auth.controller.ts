import type { FastifyReply, FastifyRequest } from "fastify";
import { type createUserBodyType } from "@repo/validation/request/auth";
import { AuthService } from "../service/auth.service";
import { AppError } from "../config/err";

export class AuthController {
  static async signupController(
    req: FastifyRequest<{ Body: createUserBodyType }>,
    reply: FastifyReply,
  ) {
    const isExist = await AuthService.userExist(req.body.email);

    if (isExist) {
      throw new AppError("User Already Exist", 409);
    }

    const data = await AuthService.signupUser(req.body);
    return reply.status(200).send({
      success: true,
      message: "User added successfully",
      data,
    });
  }
}
