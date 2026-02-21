import { Pool } from 'pg';
import { config } from '../config/env';

export class Database {
    private static pool: Pool;

    private static getPool(): Pool {
        if (!this.pool) {
            this.pool = new Pool({
                host: config.dbHost,
                port: config.dbPort,
                user: config.dbUser,
                password: config.dbPassword,
                database: config.dbName,
            });

            this.pool.on('error', (err) => {
                console.error('Unexpected error on idle client', err);
                process.exit(-1);
            });
        }
        return this.pool;
    }

    static async query(text: string, params?: any[]) {
        const client = await this.getPool().connect();
        try {
            const result = await client.query(text, params);
            return result;
        } catch (error) {
            console.error(`Database query failed: ${error}`);
            throw error;
        } finally {
            client.release();
        }
    }

    static async disconnect() {
        if (this.pool) {
            await this.pool.end();
        }
    }
}
