import fastify, { type FastifyServerOptions } from "fastify";
import { env } from "./config/env";
import { authRoutes } from "./routes/auth.route";
import { healthRoutes } from "./routes/health.route";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { DBConnection } from "./config/db";
import { errorHandler, notFoundHandler } from "./plugins/error.plugin";

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

const dbConnection = new DBConnection(app.log);
export const { db, pool } = dbConnection.getConnection();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const registerRoutes = async () => {
  try {
    await app.register(healthRoutes, { prefix: "/api" });
    await app.register(authRoutes, { prefix: "/api/auth" });
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
      reject(new Error(`Shutting timeout after ${shutdownTimeout}ms`));
    });
  });

  try {
    await Promise.race([
      (async () => {
        await app.close();
        app.log.info("[APP] Fastify server closed");

        await dbConnection.close();

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

    registerGracefulShutdown();

    await app.listen({
      port: env.PORT,
    });

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
    await dbConnection.close();
    process.exit(1);
  }
};

void startServer();
