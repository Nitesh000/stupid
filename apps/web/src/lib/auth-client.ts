import { env } from "@/config/env";
import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: env.VITE_BACKEND_URL,
});
