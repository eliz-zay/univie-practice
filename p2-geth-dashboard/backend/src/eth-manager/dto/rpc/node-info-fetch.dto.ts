export interface NodeInfoFetchDto {
    enr: string; // enr:...
    enode: string; // enode://...
    id: string;
    name: string;
    ip: string; // e.g. 127.0.0.1
    ports: {
        discovery: number;
        listener: number;
    };
    listenAddr: string; // e.g. [::]:30302
    protocols: {
        eth: {
            network: number; // network id
            difficulty: number;
            genesis: string;
            config: object;
            head: string;
        };
    }
}
