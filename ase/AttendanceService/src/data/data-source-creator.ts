
import { DataSource } from 'typeorm';
import * as path from 'path';

import { Registration } from '../model/Registration';
import { Message } from '../model/Message';

export function createDataSource(): DataSource {
    return new DataSource({
        type: 'postgres',
        host: process.env.PG_URL ?? 'localhost',
        username: process.env.POSTGRES_USER,
        password:  process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        synchronize: false,
        logging: false,
        entities: [Registration, Message],
        subscribers: [],
        migrations: [path.join('src', 'migration', '*.{js,ts}')],
    });
}
