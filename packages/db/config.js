import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
export class DrizzleDB {
    db = null;
    pool = null;
    logger;
    constructor({ url, poolConfig, logger, }) {
        this.logger = logger ?? { info: () => { }, error: () => { } };
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
        }
        catch (e) {
            this.logger.error({ error: e }, "[DB] failed to connect to db");
        }
    }
    getDB() {
        return this.db;
    }
    getPool() {
        return this.pool;
    }
    async close() {
        if (this.pool) {
            try {
                await this.pool.end();
                this.logger.info("[DB] Databaes connection closed");
            }
            catch (e) {
                this.logger.error({ error: e }, "[DB] failed to close db connection");
            }
        }
        this.logger.info("[DB] Databaes connection closed");
    }
}
