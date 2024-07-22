export type LogWeb3Dto = string | {
    address?: string;
    topics?: string[];
    data?: string;
    blockNumber?: number;
    transactionHash?: string;
    transactionIndex?: number;
    blockHash?: string;
    blockIndex?: number;
    removed?: boolean;
}
