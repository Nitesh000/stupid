import { z } from "zod";
import { config } from "dotenv";
import { fileURLToPath, URL } from "node:url";

const envPath = fileURLToPath(new URL("./../../../../.env", import.meta.url));

config({ path: envPath });

const envSchema = z.object({
  VITE_BACKEND_URL: z.url({ message: "Invalid VITE_BACKEND_URL" }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.log("[ENV] failed to parse", z.treeifyError(parsedEnv.error));
  process.exit(1);
}

export const env = parsedEnv.data;

export type EnvConfig = z.infer<typeof envSchema>;
