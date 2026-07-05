import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";

export class DrizzleDB {
  private db: NodePgDatabase | null = null;
  private pool: Pool | null = null;
  private logger;

  constructor({
    url,
    poolConfig,
    logger,
  }: {
    url: string;
    poolConfig?: PoolConfig;
    logger: { info: any; error: any };
  }) {
    this.logger = logger;
    try {
      // drizzle init
      this.db = drizzle({
        connection: url,
        logger: true,
      });

      // pg pool init
      this.pool = new Pool({
        connectionString: url,
        max: 20,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 2_000,
        ...poolConfig,
      });
      this.logger.info("[DB] drizzle connect to db");
    } catch (e) {
      this.logger.error({ error: e }, "[DB] failed to connect to db");
    }
  }

  public getDB() {
    return this.db;
  }

  public getPool() {
    return this.pool;
  }

  async close(): Promise<void> {
    if (this.pool) {
      try {
        await this.pool.end();
        this.logger.info("[DB] Databaes connection closed");
      } catch (e) {
        this.logger.error({ error: e }, "[DB] failed to close db connection");
      }
    }
    this.logger.info("[DB] Databaes connection closed");
  }
}
