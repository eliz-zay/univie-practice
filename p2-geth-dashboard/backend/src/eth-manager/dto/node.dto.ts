export interface PeersDto {
    id: string;
}

export interface NodeInfoDto {
    enr: string; // enr:...
    id: string;
    ip: string; // e.g. 127.0.0.1
    ports: {
        discovery: number;
        listener: number;
    };
}

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

export interface NodeDto {
    networkId: string;
    isMining: boolean;
    peers: PeersDto[];
    node: NodeInfoDto;
    transactionLogs: LogsDto[];
}
