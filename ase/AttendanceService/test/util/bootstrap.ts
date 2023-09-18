import path from 'path';
import dotenv from 'dotenv';
import { DataSource, EntityTarget, Repository } from 'typeorm';

interface DatabaseConfig {
    host?: string;
    port?: number;
    username: string;
    password: string;
    database: string;
}

let dataSource: DataSource;

export function useRepositories(models: EntityTarget<any>[]): Repository<any>[] {
    return models.map((model) => dataSource.getRepository(model));
}

export function getDataSource(): DataSource {
    return dataSource;
}

/**
 * Order in which tables are cleaned up matters!
 */
export async function cleanUpDatabase(models: EntityTarget<any>[]): Promise<void> {
    for await (const model of models) {
        await dataSource.getRepository(model).delete({});
    }
}

export async function bootstrapApp(): Promise<void> {
    loadEnvironmentVariables();

    if (!(
        process.env.PG_URL &&
        process.env.POSTGRES_PORT &&
        process.env.POSTGRES_USER &&
        process.env.POSTGRES_PASSWORD &&
        process.env.POSTGRES_DB
    )) {
        'Database config must be set in environment variables'
    }

    await initDatastore({
        host: process.env.PG_URL,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        database: process.env.POSTGRES_DB!
    });
}

export function loadEnvironmentVariables() {
    dotenv.config();
}

export async function initDatastore(config: DatabaseConfig): Promise<void> {
    const entitiesPath = path.join(__dirname, "../../src/model/*.*");

    dataSource = new DataSource({
        type: 'postgres',
        host: config.host ?? 'localhost',
        port: config.port ?? 5432,
        username: config.username,
        password: config.password,
        database: config.database,
        entities: [entitiesPath],
        synchronize: false,
    });

    await dataSource.initialize();
}

export async function closeApp(): Promise<void> {
    await dataSource.destroy();
}
