import { DrizzleDB } from "@repo/db/config";
import { env } from "./env";

export class DBConnection {
  private db;
  private connection;
  private pool;

  constructor(logger: any) {
    this.db = new DrizzleDB({ url: env.PG_DB_URL, logger });
    this.connection = this.db.getDB();
    this.pool = this.db.getPool();
  }

  getConnection() {
    return { db: this.connection, pool: this.pool };
  }

  async close() {
    await this.db.close();
  }
}
