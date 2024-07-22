export enum EProtocol {
    Http = 'Http',
    WebSocket = 'WebSocket'
}

// API

export interface PostNodeDto {
    name: string;
    endpoints: {
        port: number;
        protocol: EProtocol
    }[];
    dataDirId: string;
    port: number;
    authRpcPort: number;
    bootnodeId?: string;
    minerAccountId?: string;
}

// Table

export interface NodeListDto {
    id: string;
    isRunning: boolean;
    pid: number;
    name: string;
    endpoints: {
        port: number;
        protocol: EProtocol
    }[];
    dataDir: {
        id: string;
        name: string;
        dir: string;
        genesis: {
            id: string;
            name: string;
            networkId: string;
        }
    };
    port: number;
    authRpcPort: number;
    bootnode?: {
        id: string;
        name: string;
    };
    minerAccount?: {
        id: string;
        name: string;
        address: string;
        password: string;
    };
    createdAt: Date;
}

// Card

export interface LogsDto {
    stringLog?: string;
    address?: string;
    topics?: string[];
    data?: string;
    blockNumber?: number;
    transactionHash?: string;
    transactionIndex?: number;
    blockHash?: string;
    logIndex?: number;
    removed?: boolean;
}

export interface NodeCardDto extends NodeListDto {
    logs: string;
    ethInfo?: {
        networkId: string;
        isMining: boolean;
        peers: {
            id: string;
        }[];
        node: {
            enr: string; // enr:...
            id: string;
            ip: string; // e.g. 127.0.0.1
            ports: {
                discovery: number;
                listener: number;
            };
        };
        transactionLogs: LogsDto[];
    }
}

// Peer nodes

export interface NodePeersNodeDto {
    id: string;
    name: string;
    ethId: string;
    peers: {
        id: string;
    }[];
}

export interface NodePeersDto {
    networkId: string;
    genesisName: string;
    nodes: NodePeersNodeDto[];
}
