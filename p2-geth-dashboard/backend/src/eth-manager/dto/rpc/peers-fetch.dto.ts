export interface PeersFetchDto {
    enr: string; // enr:...
    enode: string; // enode://...
    id: string;
    name: string;
    caps: string[];
    network: object;
    protocols: object;
}
