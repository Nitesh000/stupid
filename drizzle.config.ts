// drizzle.config.ts
/// <reference types="node" />

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle", // Where migration files will be saved
  schema: "./packages/db/schema/index.ts", // Path to your schema file
  dialect: "postgresql", // Your database dialect
  dbCredentials: {
    url: process.env.PG_DB_URL!, // Connection string from .env
  },
});
