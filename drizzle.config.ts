// drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle", // Where migration files will be saved
  schema: "./packages/db/schema/index.ts", // Path to your schema file
  dialect: "postgresql", // Your database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Connection string from .env
  },
});
