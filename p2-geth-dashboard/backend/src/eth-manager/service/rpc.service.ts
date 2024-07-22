import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fetch from 'node-fetch';

import { NodeInfoDto, NodeInfoFetchDto, PeersDto, PeersFetchDto, RpcFetchDto } from '../dto';

enum EthRpcMethod {
    Peers = 'admin_peers',
    NodeInfo = 'admin_nodeInfo',
}

/**
 * Geth RPC wrapper for peers and node info
 */
@Injectable()
export class RpcService {
    constructor() {}

    async getPeers(url: string): Promise<PeersDto[]> {
        const response = await this.fetch<PeersFetchDto[]>(url, EthRpcMethod.Peers);

        return response.map((node) => ({
            id: node.id
        }));
    }

    async getNodeInfo(url: string): Promise<NodeInfoDto> {
        const response = await this.fetch<NodeInfoFetchDto>(url, EthRpcMethod.NodeInfo);

        return {
            enr: response.enr,
            id: response.id,
            ip: response.ip,
            ports: response.ports,
        };
    }

    private async fetch<T>(url: string, method: EthRpcMethod): Promise<T> {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ method, jsonrpc: '2.0', id: '1' })
        });

        if (!response.ok) {
            throw new InternalServerErrorException(url + ': ' + response.statusText);
        }

        const responseBody: RpcFetchDto<T> = await response.json();

        return responseBody.result;
    }
}
