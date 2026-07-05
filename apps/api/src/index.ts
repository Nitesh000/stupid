import fastify, { type FastifyServerOptions } from "fastify";
import { env } from "./config/env";
import { authRoutes } from "./routes/auth.route";
import { healthRoutes } from "./routes/health.route";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

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

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
    });
    app.log.info({ port: env.PORT }, "[APP] API started");
  } catch (err) {
    app.log.fatal({ err }, "[APP] API startup failed");
    process.exit(1);
  }
};

await app.register(healthRoutes, { prefix: "/api" });
await app.register(authRoutes, { prefix: "/api/auth" });

void start();
