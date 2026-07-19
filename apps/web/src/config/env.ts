import { z } from "zod";

const envSchema = z.object({
  VITE_BACKEND_URL: z.url().default("http://localhost:8080"),
});

export const env = envSchema.parse({
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
});

export type EnvConfig = z.infer<typeof envSchema>;
