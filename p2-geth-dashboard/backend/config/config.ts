import * as path from 'path';

export interface AppConfig {
    port: number;
}

export interface DbConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
}

export interface EthereumConfig {
    nodesHost: string;
    logsDir: string;
    tmpFilesDir: string;
    accountsDataDir: string;
    genesisDir: string;
}

export interface Config {
    app: AppConfig;
    db: DbConfig;
    ethereum: EthereumConfig;
}

/**
 * Environment variables wrapper
 */
export default () => <Config>({
    app: {
        port: Number(process.env.PORT) ?? 8000
    },
    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) ?? 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
    },
    ethereum: {
        nodesHost: process.env.ETH_NODES_HOST,
        logsDir: path.join(process.env.ETH_LOCAL_STORAGE ?? '../storage', 'logs'),
        accountsDataDir: path.join(process.env.ETH_LOCAL_STORAGE ?? '../storage', 'accounts'),
        tmpFilesDir: path.join(process.env.ETH_LOCAL_STORAGE ?? '../storage', 'tmp'),
        genesisDir: path.join(process.env.ETH_LOCAL_STORAGE ?? '../storage', 'genesis'),
    }
});
