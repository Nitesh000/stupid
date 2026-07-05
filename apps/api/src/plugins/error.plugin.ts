import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env";

export const errorHandler = (
  error: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  req.log.error({
    error: {
      message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    },
    statusCode,
    path: req.url,
    code: error.code,
  });

  const response: {
    success: boolean;
    message: string | undefined;
    stack?: string | undefined;
  } = {
    success: false,
    message,
  };

  if (["local", "developmemnt"].includes(env.NODE_ENV)) {
    response.stack = error.stack;
  }

  return reply.status(statusCode).send(response);
};

// 404 handler
export const notFoundHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  return reply.status(404).send({
    success: false,
    message: `Route ${request.method}:${request.url} not found`,
  });
};
