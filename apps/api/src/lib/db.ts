import { DrizzleDB } from "@repo/db/config";
import { env } from "../config/env";

const dbConnection = new DrizzleDB({
  url: env.PG_DB_URL,
});

export const db = dbConnection.getDB();
export const pool = dbConnection.getPool();

export const closeDB = async () => {
  await dbConnection.close();
};
