import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { getPostgresDBConfig } from './app.config';

dotenv.config();

const config = getPostgresDBConfig();

export const dataSource: DataSource = new DataSource(config);
