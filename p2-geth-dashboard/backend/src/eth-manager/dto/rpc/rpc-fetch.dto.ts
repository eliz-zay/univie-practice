export interface RpcFetchDto<T> {
    jsonrpc: string;
    id: number;
    result: T;
}
