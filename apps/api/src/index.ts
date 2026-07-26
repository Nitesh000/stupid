import fastify, { type FastifyServerOptions } from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env";
import { healthRoutes } from "./routes/health.route";
import { leaderboardRoutes } from "./routes/leaderboard.route";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { closeDB } from "./lib/db";
import { auth } from "./lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { errorHandler, notFoundHandler } from "./plugins/error.plugin";
import { connectRedis, closeRedis } from "./lib/redis";
import { initSocketIO } from "./lib/socket";

const logger: FastifyServerOptions["logger"] =
  env.NODE_ENV == "production"
    ? {
        level: "info",
      }
    : {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      };

const app = fastify({
  logger,
});

// global error handlers
app.setErrorHandler(errorHandler);
app.setNotFoundHandler(notFoundHandler);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const registerRoutes = async () => {
  try {
    // Register CORS
    await app.register(cors, {
      origin: env.CORS_ORGINS,
      credentials: true,
    });

    await app.register(healthRoutes, { prefix: "/api" });
    await app.register(leaderboardRoutes, { prefix: "/api" });

    // Better Auth Catch-All route
    app.all("/api/auth/*", async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const headers = fromNodeHeaders(request.headers);

      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      });

      const response = await auth.handler(req);

      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      return reply.send(response.body ? await response.text() : null);
    });

    app.log.info("[APP] Routes registered");
  } catch (e) {
    app.log.error({ error: e }, "[APP] Failed to register routes");
  }
};

const gracefullyShutdown = async (signal: string) => {
  const shutdownTimeout = 10_000;
  let timeoutId = null;

  app.log.info(
    { signal },
    `[APP] Received ${signal}, gracefully shutting down...`,
  );

  // force exit if timeout passes
  const forceExit = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Shutdown timeout after ${shutdownTimeout}ms`));
    }, shutdownTimeout);
  });

  try {
    await Promise.race([
      (async () => {
        await app.close();
        app.log.info("[APP] Fastify server closed");

        await closeRedis();
        await closeDB();

        app.log.info("[APP] Graceful shutdown completed");
      })(),
      forceExit,
    ]);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    process.exit(0);
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (error instanceof Error && error.message.includes("Shutdown timeout")) {
      app.log.error("[APP] Shutdown timed out, forcing exit");
    } else {
      app.log.error({ error }, "[APP] Error during graceful shutdown");
    }
    process.exit(1);
  }
};

const registerGracefulShutdown = async () => {
  const signals: NodeJS.Signals[] = ["SIGTERM", "SIGINT", "SIGQUIT"];

  for (const signal of signals) {
    process.on(signal, () => {
      gracefullyShutdown(signal);
    });
  }
  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    app.log.fatal({ error }, "[APP] Uncaught exception");
    gracefullyShutdown("uncaughtException");
  });

  // Handle unhandled rejections
  process.on("unhandledRejection", (reason) => {
    app.log.fatal({ reason }, "[APP] Unhandled rejection");
    gracefullyShutdown("unhandledRejection");
  });

  app.log.info("[APP] Shutdown handlers registered");
};

const startServer = async () => {
  try {
    await registerRoutes();
    await connectRedis();

    registerGracefulShutdown();

    await app.listen({
      port: env.PORT,
    });

    // Initialise Socket.io on the HTTP server after Fastify starts
    initSocketIO(app.server, env.CORS_ORGINS);

    app.log.info(
      {
        port: env.PORT,
        env: env.NODE_ENV,
      },
      "[APP] API started successfully",
    );
  } catch (err) {
    app.log.fatal({ err }, "[APP] API startup failed");

    // attempt to close the db connection
    await closeDB();
    process.exit(1);
  }
};

void startServer();
