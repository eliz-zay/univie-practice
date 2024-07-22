import { EProtocol } from '../../model';

export interface SpawnDto {
    endpoints: {
        port: number;
        protocol: EProtocol;
    }[];
    dataDir: string;
    port: number;
    authRpcPort: number;
    bootnode?: {
        host: string;
        port: number;
    };
    minerAccount?: {
        address: string;
        password: string;
        secretKeyPath: string;
    };
    logFile: string;
}
