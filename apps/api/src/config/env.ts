import dotenv from "dotenv";
import { fileURLToPath, URL } from "node:url";
import { z } from "zod";

const envPath = fileURLToPath(new URL("./../../../../.env", import.meta.url));

dotenv.config({ path: envPath });

const envSchema = z.object({
  // backend config
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "staging", "production", "local"])
    .default("local"),
  PG_DB_URL: z.url({ message: "Invlid database url format" }),
});

const parseEnv = envSchema.safeParse(process.env);

if (!parseEnv.success) {
  console.error(
    "[env] Invlid environment variables:",
    z.treeifyError(parseEnv.error),
  );
  process.exit(1);
}

export const env = parseEnv.data;
export type EnvConfig = z.infer<typeof envSchema>;
