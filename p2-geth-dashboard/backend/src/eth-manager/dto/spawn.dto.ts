export enum EProtocol {
    WebSocket = 'WebSocket',
    Http = 'Http',
}

interface EndpointDto {
    port: number;
    protocol: EProtocol;
}

export interface SpawnDto {
    endpoints: EndpointDto[];
    dataDir: string;
    port: number;
    authRpcPort: number;
    bootnode?: {
        port: number;
        host: string;
    };
    minerAccount?: {
        address: string;
        password: string;
        secretKeyPath: string;
    };
    logFile: string;
}
